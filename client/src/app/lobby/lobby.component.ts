import { Component, OnInit, Output, Input } from '@angular/core';
import { User } from '../models/User';
import { Challenge } from '../models/Challenge';
import { LobbyService } from './lobby.service';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../login/auth.service';
import { WebsocketService } from '../websocket.service';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  @Output() public user: User;
  @Output() players: User[] = [];
  challenges: Challenge[] = [];
  processChallengeSubscription: Subscription;
  displayUserSubscription: Subscription;
  setUserSubscription: Subscription;
  loggedIn: boolean;

  constructor(private http: HttpService, private lobbyService: LobbyService, private authService: AuthService,
  private wsService: WebsocketService) { }

  ngOnInit() {
    // Update when user logs in
    this.user = this.authService.user;
    this.loggedIn = this.user.username !== 'Guest';
    this.setUserSubscription = this.authService.setUserSource
      .subscribe((user: User) => {
        this.user = user;
        this.loggedIn = true;
      });

    // GET available players from server
    this.lobbyService.getActiveUsers()
      .subscribe((players: User[]) => {
        this.players = players.filter(usr => usr.username !== this.user.username);
      });

    // Subscribe to viewing new users that come online
    this.displayUserSubscription = this.lobbyService.displayUserSource
      .subscribe((user: User) => {
        if (!this.players.some(p => p.username === user.username))  {
          this.players.push(user);
        }
      });

    // Subscribe to updated profiles of other users
    this.wsService.profileEventSource
      .subscribe((user: User) => {
        if (user.id !== this.user.id) {
          const updatedPlayers = this.players.filter(p => p.id === user.id);
          if (updatedPlayers !== []) {
            const oldPlayer = updatedPlayers[0];
            const index = this.players.indexOf(oldPlayer);
            this.players.splice(index, 1, user);
          }
        }
      });

    // Subscribe to new/accepted/rejected/cancelede challenges from players
    this.processChallengeSubscription = this.lobbyService.processChallengeSource
      .subscribe((challenge: Challenge) => {
        this.processChallenge(challenge);
      });
  }

  processChallenge(challenge: Challenge) {
    switch (challenge.status) {
      case 'pending':
        this.challenges.push(challenge);
        break;
      case 'cancel':
        this.challenges = this.challenges.filter(c => c.issuer !== challenge.issuer && c.receiver !== challenge.receiver);
        break;
      case 'accept':
        this.challenges = this.challenges.filter(c => c.issuer !== challenge.issuer && c.receiver !== challenge.receiver);

        // Determine who issued the challenge, and therefore begins to shoot
        const clientStarts = challenge.issuer === this.user.username;
        // Create user object for opponent
        const opponent = new User();
        opponent.username = clientStarts ? challenge.receiver : challenge.issuer;
        this.lobbyService.initGame(this.user, opponent, clientStarts);
        break;
      case 'reject':
        this.challenges = this.challenges.filter(c => c.issuer !== challenge.issuer && c.receiver !== challenge.receiver);
        alert('challenge issued by: ' + challenge.issuer + ' just got rejected by: ' + challenge.receiver);
        break;
      default:
        console.log('Unidentified CHALLENGE object from websocket:');
    }
  }

  issueChallenge(user: User) {
    const alreadyChallenged = this.challenges.filter(c => (c.issuer === this.user.username && c.receiver === user.username));
    console.log('already challenged: ', alreadyChallenged);
    if (alreadyChallenged.length > 0) {
      return;
    }
    const obj = { type: 'challenge', payload: { issuer: this.user.username, receiver: user.username, status: 'pending' } };
    this.lobbyService.sendChallengeEvent(obj.payload, 'pending', 'successfully issued challenge: ', 'failed to issue challenge: ');
  }

  updateChallenge(challenge, status) {
    this.lobbyService.sendChallengeEvent(challenge, status, `successfully ${status}ed challenge: `, `failed to ${status} challenge: `);
  }
}

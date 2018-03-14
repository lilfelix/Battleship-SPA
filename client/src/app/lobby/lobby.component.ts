import { Component, OnInit, Output } from '@angular/core';
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

  constructor(private http: HttpService, private lobbyService: LobbyService) { }

  ngOnInit() {

    // Set current user
    this.user = this.lobbyService.user;
    console.log('init lobbyCmp user:' + this.user.username);

    // GET available players from server
    this.lobbyService.getActiveUsers()
      .subscribe((players: User[]) => {
        this.players = players.filter(usr => usr.username !== this.user.username);
      });

    // Subscribe to viewing new users that come online
    this.displayUserSubscription = this.lobbyService.displayUserSource
      .subscribe((user: User) => {
        if (user.username !== this.user.username) { this.players.push(user); }
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
        const opponent = new User();
        opponent.username = challenge.issuer === this.user.username ? challenge.receiver : challenge.issuer;
        this.lobbyService.initGame(this.user, opponent, true);
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

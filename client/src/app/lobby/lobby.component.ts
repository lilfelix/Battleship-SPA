import { Component, OnInit, Output } from '@angular/core';
import { User } from '../models/User';
import { Challenge } from '../models/Challenge';
import { LobbyService } from './lobby.service';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../login/auth.service';
import { WebsocketService } from '../websocket.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  @Output() public user: User;
  @Output() players: User[];
  challenges: Challenge[] = [];
  processChallengeSubscription: Subscription;
  displayUserSubscription: Subscription;

  constructor(private lobbyService: LobbyService, private wsService: WebsocketService) { }

  ngOnInit() {

    // Set current user
    this.user = this.lobbyService.user;

    // GET available players from server
    this.lobbyService.getActiveUsers()
      .subscribe((players: User[]) => {
        this.players = players.filter(usr => usr.username !== this.user.username);
      });

    // Subscribe to viewing new users that come online
    this.displayUserSubscription = this.lobbyService.displayUserSource
      .subscribe((user: User) => { this.players.push(user); });

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
        this.lobbyService.initGame(this.user, opponent);
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
    this.lobbyService.sendChallenge(obj)
      .subscribe((result: any) => {
        result.success ? console.log('successful challenge: ' + obj.payload.receiver) :
          console.log('failed challenge: ' + obj.payload.receiver);
      });
  }

  cancelChallenge(challenge: Challenge) {
    const obj = { type: 'challenge', payload: { issuer: challenge.issuer, receiver: challenge.receiver, status: 'cancel' } };
    this.lobbyService.sendChallenge(obj)
      .subscribe((result: any) => {
        result.success ? console.log('successfully canceled challenge: ' + obj.payload.receiver) :
          console.log('failed to cancel challenge: ' + obj.payload.receiver);
      });
  }

  acceptChallenge(challenge: Challenge) {
    const obj = { type: 'challenge', payload: { issuer: challenge.issuer, receiver: challenge.receiver, status: 'accept' } };
    this.lobbyService.sendChallenge(obj)
      .subscribe((result: any) => {
        result.success ? console.log('successfully accepted challenge: ' + obj.payload.receiver) :
          console.log('failed to accept challenge: ' + obj.payload.receiver);
      });
  }

  rejectChallenge(challenge: Challenge) {
    const obj = { type: 'challenge', payload: { issuer: challenge.issuer, receiver: challenge.receiver, status: 'reject' } };
    this.lobbyService.sendChallenge(obj)
      .subscribe((result: any) => {
        result.success ? console.log('successfully rejected challenge: ' + obj.payload.receiver) :
          console.log('failed to reject challenge: ' + obj.payload.receiver);
      });
  }

}

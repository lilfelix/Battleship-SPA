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
  displayChallengeSubscription: Subscription;
  displayNewUserSubscription: Subscription;

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
    this.displayNewUserSubscription = this.lobbyService.displayUserSource
      .subscribe((user: User) => { this.players.push(user); });

    // Subscribe to challenges from other players
    this.displayChallengeSubscription = this.lobbyService.displayChallengeSource
      .subscribe((challenge: Challenge) => {
        console.log('pushing challenge to list: ', challenge);
        this.challenges.push(challenge);
      });
  }

  challengePlayer(user: User) {
    const alreadyChallenged = this.challenges.filter(c => (c.issuer === this.user.username && c.receiver === user.username));
    console.log('already challenged: ', alreadyChallenged);
    if (alreadyChallenged.length > 0) {
      return;
    }
    const obj = { type: 'challenge', issuer: this.user.username, receiver: user.username, status: 'pending' };
    this.lobbyService.sendChallenge(obj)
      .subscribe((result: any) => {
        result.success ? console.log('successful challenge: ' + obj.receiver) : console.log('failed challenge: ' + obj.receiver);
      });
  }

  cancelChallenge(challenge: Challenge) {
    return true;
  }

  acceptChallenge(challenge: Challenge) {
    return true;
  }

  rejectChallenge(challenge: Challenge) {
    return true;
  }

}

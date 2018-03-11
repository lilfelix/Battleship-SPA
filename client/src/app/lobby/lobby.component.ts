import { Component, OnInit } from '@angular/core';
import { User } from '../models/User';
import { Challenge } from '../models/Challenge';
import { LobbyService } from './lobby.service';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../login/login.service';
import { WebsocketService } from '../websocket.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  user: User;
  players: User[];
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
      .subscribe((user: User) => { this.players.push(user);  });

    // Subscribe to challenges from other players
    this.displayChallengeSubscription = this.lobbyService.displayChallengeSource
      .subscribe((challenge: Challenge) => { this.challenges.push(challenge); });
  }

  challengePlayer(user: User) {
    // TODO return Challenge object and send on websocket
    return true;
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

import { Component, OnInit } from '@angular/core';
import { User } from '../models/User';
import { Challenge } from '../models/Challenge';
import { LobbyService } from './lobby.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  username: string;
  players: User[];
  challenges: Challenge[] = [];
  displayChallengeSubscription: Subscription;

  constructor(private lobbyService: LobbyService) { }

  ngOnInit() {

    // Subscribe to challenges from other players
    this.displayChallengeSubscription = this.lobbyService.displayChallengeSource
    .subscribe((challenge: Challenge) => { this.challenges.push(challenge); });

    // GET available players from server
    this.lobbyService.getAvailablePlayers()
    .subscribe((players: User[]) => {
      this.players = players;
    });
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

import { Component, OnInit } from '@angular/core';
import { BoardComponent } from './board/board.component';
import { User } from '../models/User';
import { LobbyService } from '../lobby/lobby.service';
import { GameService } from './game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  public size = 3;

  constructor(private lobbyService: LobbyService, private gameService: GameService) {}

  ngOnInit() {
    this.gameService.players = this.lobbyService.getPlayers();
    this.gameService.starts = this.lobbyService.starts;
    this.gameService.listenWebSocket();
  }
}

import { Component, OnInit, Output } from '@angular/core';
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

  @Output() public size = 3;
  @Output() public players;


  constructor(private lobbyService: LobbyService, private gameService: GameService) { }

  ngOnInit() {
    // this.size = this.lobbyService.size;
    this.gameService.players = this.lobbyService.getPlayers();
    this.players = this.lobbyService.getPlayers();
    this.gameService.clientStarts = this.lobbyService.starts;
    this.gameService.listenWebSocket();
  }
}

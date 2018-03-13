import { Component, OnInit } from '@angular/core';
import { BoardComponent } from './board/board.component';
import { User } from '../models/User';
import { LobbyService } from '../lobby/lobby.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  id: number;
  players: User[];
  player1Score: number;
  player2Score: number;
  finished: boolean;
  boards: BoardComponent[] = [];

  constructor(private lobbyService: LobbyService) {}

  ngOnInit() {
    this.players = this.lobbyService.getPlayers();
    for (let i = 0; i < 2; i++) {
      this.boards[i] = new BoardComponent(i, 3, this.players[i], false);
    }
  }
}

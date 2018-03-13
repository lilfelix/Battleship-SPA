import { User } from '../../models/User';
import { Highscore } from '../../models/Highscore';
import { Game } from '../../models/Game';
import { Message } from '../../models/Message';
import { Board } from '../../models/Board';
import { Tile } from '../../models/Tile';
import { Component, Input, OnInit } from '@angular/core';
import { GameService } from '../game.service';


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit {

  @Input() size: number; // Dimension of boards
  @Input() myTurn = false; // Indicates if it's the client's turn to shoot
  @Input() players: User[]; // players[0] is always the client
  boards: Board[] = []; // boards[0] has id == 1 and belongs to client

  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.boards.push(new Board(1, this.size, this.players[0], false));
    this.boards.push(new Board(2, this.size, this.players[1], false));
    console.log('BOARDS', this.boards);
  }

  clickEvent(tile: Tile, board: Board) {
    // Player can only interact with his own board when placing ships
    if (!board.frozen && board.id === 1) {
      board.placeShip(tile);
    } else if (board.frozen && board.id === 2 && this.myTurn) {
      // TODO call service to drop bomb at tile
    }
  }

  freezeBoard() {
    this.boards[0].frozen = true;
    this.gameService.sendReadyState(this.boards[0], this.players);
  }
}

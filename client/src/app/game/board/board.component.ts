import { User } from '../../models/User';
import { Highscore } from '../../models/Highscore';
import { Game } from '../../models/Game';
import { Message } from '../../models/Message';
import { Board } from '../../models/Board';
import { Tile } from '../../models/Tile';
import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit {

  @Input() players: User[];
  @Input() size: number;
  boards: Board[] = [];

  constructor() {}

  ngOnInit() {
    this.boards.push(new Board(1, this.size, this.players[0], false));
    this.boards.push(new Board(2, this.size, this.players[1], false));
    console.log('BOARDS', this.boards);
  }
}

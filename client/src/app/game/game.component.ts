import { Component, OnInit } from '@angular/core';
import { BoardComponent } from './board/board.component';
import { User } from '../models/User';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  id: number;
  users: User[];
  player1Score: number;
  player2Score: number;
  finished: boolean;
  boards: BoardComponent[] = [];

  constructor(users: User[]) {
    for (let i = 0; i < 2; i++) {
      this.boards[i] = new BoardComponent(i, 3, users[i], false);
    }
  }

  ngOnInit() {
  }

}

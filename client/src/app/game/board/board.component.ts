import { User } from '../../models/User';
import { Highscore } from '../../models/Highscore';
import { Game } from '../../models/Game';
import { Message } from '../../models/Message';
import { Tile } from '../../models/Tile';

export class BoardComponent {

  tiles: Tile[][];
  boardStyles: any = {};

  constructor(public id: number, public size: number, public owner: User, public frozen: boolean) {
    // Generate tiles for board
    for (let i = 0; i < size; i++) {
      this.tiles[i] = [];
      for (let j = 0; j < size; j++) {
        this.tiles[i][j] = new Tile(false, false, i + 1, j + 1);
      }
    }
    this.setBoardStyles(true);
  }

  setBoardStyles(focus: boolean) {
    this.boardStyles = {
      'grid-template-columns': `${this.size}`,
      'grid-template-rows': `${this.size}`,
      'opacity': focus ? '1' : '0.5'
    };
  }
}

import { User } from './User';
import { Tile } from './Tile';

export class Board {

    tiles: Tile [][] = [];
    boardStyles: any = {};
    totalNumShips: number;
    numPlacedShips = 0;
    score = 0;
    bombsDropped = 0;

    constructor(public id: number, public size: number, public owner: User, public frozen: boolean) {
        // Generate tiles for board
        for (let i = 0; i < size; i++) {
            this.tiles[i] = [];
            for (let j = 0; j < size; j++) {
                this.tiles[i][j] = new Tile(false, false, i + 1, j + 1);
            }
        }
        this.setBoardStyles(true);
        this.totalNumShips = 3;
    }

    setBoardStyles(focus: boolean) {
        this.boardStyles = {
            'display': 'grid',
            'grid-template-columns': `${this.size}`,
            'grid-template-rows': `${this.size}`,
            'opacity': focus ? '1' : '0.5'
        };
    }

    placeShip(tile: Tile) {
        if (tile.used) {
            this.numPlacedShips--;
            Tile.setTileStyles(tile, false, false);
        } else {
            this.numPlacedShips++;
            Tile.setTileStyles(tile, true, false);
        }
        return this.numPlacedShips === this.totalNumShips;
    }
}

import { User } from './User';
import { BoardComponent } from '../game/board/board.component';
export class Game {

    id: number;
    users: User[];
    player1Score: number;
    player2Score: number;
    finished: boolean;
    boards: BoardComponent[];

}

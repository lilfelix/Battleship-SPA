import { User } from './User';
import { Board } from './Board';
export class Game {

    id: number;
    users: User[];
    player1Score: number;
    player2Score: number;
    finished: boolean;
    boards: Board[];

}

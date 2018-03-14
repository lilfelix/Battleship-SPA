import {User} from './User';

export class Highscore {
    id?: number;
    user: User;
    numGames: number;
    numWon: number;
    numLost: number;
}

import { User } from './User';
import { Highscore } from './Highscore';
import { Game } from './Game';
import { Message } from './Message';

export class Board {

    id: number;
    dimension: number;
    game: Game;
    owner: User;
    rows: string[];
    columns: string[];
    frozen: boolean;
}

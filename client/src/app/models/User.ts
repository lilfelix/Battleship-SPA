import { Game } from './Game';
import { BoardComponent } from '../game/board/board.component';
import { Highscore } from './Highscore';
import { Message } from './Message';

export class User {
    id?: number;
    username: string;
    name?: string;
    highscore?: Highscore;
    games?: Game[];
    boards?: BoardComponent[];
    receivedMsgs?: Message[];
    sentMsgs?: Message[];
}

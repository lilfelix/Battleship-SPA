import { Game } from './Game';
import { Board } from './Board';
import { Highscore } from './Highscore';
import { Message } from './Message';

export class User {
    id?: number;
    username: string;
    name?: string;
    highscore?: Highscore;
    games?: Game[];
    boards?: Board[];
    receivedMsgs?: Message[];
    sentMsgs?: Message[];
}

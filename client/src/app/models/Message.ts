import { User } from './User';

export class Message {
    id?: number;
    recipient?: User;
    timestamp?: string;

    constructor (private sender: User, private text: string) {}
}

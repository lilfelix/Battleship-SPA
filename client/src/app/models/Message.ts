import { User } from './User';

export class Message {
    id: number;
    sender: User;
    recipient: User; // Undefined if sent to all?
    text: string;
    timestamp: string;
}

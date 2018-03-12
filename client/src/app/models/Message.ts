import { User } from './User';

export class Message {
    id?: number;
    sender: string; // username
    recipient?: User;
    text: string;
    timestamp?: string;
}

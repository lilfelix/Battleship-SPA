import { User } from './User';

export class AuthResponse {
    payload: User|{};
    token: string;
}

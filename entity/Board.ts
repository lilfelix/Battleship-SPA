import {Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, ManyToOne, OneToMany} from "typeorm";
import {User} from './User';
import { Game } from "./Game";

@Entity()
export class Board {

    @Column()
    numGames: number;

    @Column()
    numWon: number;

    @Column()
    numLost: number;

    // A board has only one user. A user can have many boards
    // @JoinColumn() can be emitted in OneToMany/ManyToOne
    @ManyToOne(type => User, owner => owner.boards)
    owner: User;

    // A game has two boards
    @ManyToOne(type => Game, game => game.boards)
    game: Game;
}

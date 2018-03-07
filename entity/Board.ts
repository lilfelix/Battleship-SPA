import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, ManyToOne, OneToMany } from "typeorm";
import { User } from './User';
import { Game } from "./Game";

@Entity()
export class Board {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    dimension: number;

    // A board belongs to a game. A game has two boards
    @ManyToOne(type => Game, game => game.boards)
    game: Game;

    // A board has only one user. A user can have many boards
    // @JoinColumn() can be emitted in OneToMany/ManyToOne
    @ManyToOne(type => User, owner => owner.boards)
    owner: User;

    // A row and col makes a tile which can be 'empty', 'set' or 'hit' 
    @Column('simple-array')
    rows: string[];

    @Column('simple-array')
    columns: string[];

    // frozen indicates whether ships can be moved or not
    @Column()
    frozen: boolean;

    // @Column()
    // shipId: number;

}

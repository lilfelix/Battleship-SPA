import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { User } from './User'
import { Board } from "./Board";

@Entity()
export class Game {

    @PrimaryGeneratedColumn()
    id: number;

    // // A user can participate in many games. A game can have many users
    // @ManyToMany(type => User, user => user.games)
    // @JoinTable()
    // users: User[];

    @Column()
    player1Score: number;

    @Column()
    player2Score: number;

    @Column()
    finished: boolean;

    // A board has only one game. A game has many (2) boards
    @OneToMany(type => Board, board => board.game)
    boards: Board[];

}

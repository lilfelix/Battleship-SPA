import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { User } from './User'

@Entity()
export class Game {

    @PrimaryGeneratedColumn()
    id: number;

    // A user can participate in many games. A game can have many users
    @ManyToMany(type => User, user => user.games)
    @JoinTable()
    users: User[];

    @Column()
    player1Score: number;

    @Column()
    player2Score: number;

    @Column()
    finished: boolean;

}

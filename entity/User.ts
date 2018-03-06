import {Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToMany} from "typeorm";
import { Highscore } from "./Highscore";
import { Game } from "./Game";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    name: string;

    @Column()
    pwHash: string;

    @OneToOne(type => Highscore, highscore => highscore.user, {
        cascadeInsert: true,
        cascadeUpdate: true,
        cascadeRemove: true
    })
    highscore: Highscore;

    // A user can participate in many games. A game can have many users
    @ManyToMany(type => Game, game => game.users)
    games: Game[];

}

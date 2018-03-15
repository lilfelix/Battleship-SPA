import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToMany, OneToMany, JoinColumn} from "typeorm";
import { Highscore } from "./Highscore";
import { Game } from "./Game";
import { Board } from "./Board";
import { Message } from "./Message";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    name: string;

    @Column({
        nullable: true,
        default: null 
    })
    pwHash: string;

    @OneToOne(type => Highscore, highscore => highscore.user, {
        eager: true,
        cascadeInsert: true,
        cascadeRemove: true
    })
    highscore: Highscore;

    // A user can participate in many games. A game can have many users
    // @ManyToMany(type => Game, game => game.users)
    // games: Game[];

    // A board has only one user. A user can have many boards
    // @OneToMany(type => Board, board => board.owner)
    // boards: Board[];

    // @JoinColumn() can be emitted in OneToMany/ManyToOne
    // @OneToMany(type => Message, message => message.recipient)
    // receivedMsgs: Message[];

    @OneToMany(type => Message, message => message.sender)
    sentMsgs: Message[];

}

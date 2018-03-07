import {Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, PrimaryColumn} from "typeorm";
import {User} from './User';

@Entity()
export class Highscore {

    @PrimaryColumn()
    @OneToOne(type => User, user => user.highscore)
    @JoinColumn()
    user: User;

    @Column()
    numGames: number;

    @Column()
    numWon: number;

    @Column()
    numLost: number;

}

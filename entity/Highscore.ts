import {Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne} from "typeorm";
import {User} from './User';

@Entity()
export class Highscore {

    @Column()
    numGames: number;

    @Column()
    numWon: number;

    @Column()
    numLost: number;

    @OneToOne(type => User, user => user.highscore)
    user: User;

}

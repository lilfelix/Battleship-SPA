import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, OneToMany, ManyToMany, JoinTable, Timestamp } from "typeorm";
import { User } from './User'

@Entity()
export class Game {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(type => User)
    @JoinColumn()
    sender: User

    @OneToOne(type => User)
    @JoinColumn()
    recipient: User //undefined if sent to all?

    @Column()
    text: string;

    @Column()
    timestamp: Timestamp;
}

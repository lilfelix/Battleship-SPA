import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne, OneToMany, ManyToMany, JoinTable, Timestamp, ManyToOne } from "typeorm";
import { User } from './User'

@Entity()
export class Message {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, user => user.sentMsgs)
    sender: User

    // @ManyToOne(type => User, user => user.receivedMsgs)
    // recipient: User //undefined if sent to all?

    @Column()
    text: string;

    @Column('timestamp')
    timestamp: number;
}

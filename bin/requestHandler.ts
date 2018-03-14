"use strict";
/**
 * Module dependencies.
 */

const Server = require('../server.ts');
const debug = require('debug')('projekt:server');
import WebSocket = require('ws');
import * as http from 'http';
import * as url from 'url';
import { ServerOptions } from 'http2';
import bcrypt from 'bcrypt';
import { server } from '../bin/www';

import "reflect-metadata";
import { createConnection, Connection, getConnection, getRepository } from "typeorm";
import { User } from "../entity/User";
const authSecret = '@9O37m1O3ISg';
const saltRounds = 10;

// Input { type: 'login', username: this.username, password: this.password };
export async function authUser(body: any) {
    const repository = getRepository(User);
    const user = await repository.findOne({ username: body.username });
    if (user == null) {
        return {};
    } else {
        return bcrypt.compare(body.password, user.pwHash)
            .then(function (res) {
                return res ? { type: 'login', payload: { id: user.id, name: user.name, username: user.username } } : {};
            });
    }
}

// Input { type: 'register', username: this.username, name: this.name, password: this.password }
export function createUser(body: any) {

    return bcrypt.hash(body.password, saltRounds)
        .then(async function (hash) {
            // Check that user doesn't already exist
            const repository = getRepository(User);
            const test = await repository.findOne({ username: body.username });
            if (test != null) {
                return {};
            } else {
                const user = await repository.save({ username: body.username, name: body.name, pwHash: hash });
                console.log('newly registered user:');
                console.dir(user);
                return user ? { type: 'register', payload: { name: user.name, username: user.username } } : {};
            }
        });
}

// Active users are those who have a websocket connection open
export function getActiveUsers() {
    const names: string[] = Array.from(server.openSockets.keys());
    console.log('keys from sockets', names);
    // const repository = getRepository(User);
    // const users = await repository.find({
    // select: ["id", "name", "username"],
    //     // relations: ["highscore", "games", "boards", "receivedMsgs", "sentMsgs"],
    // });
    const users: any[] = [];
    names.forEach(n => {
        users.push({ username: n });
    });
    return users;
}

// Send challenges to affected sockets.
export function sendChallenges(obj: any) {
    const payload = obj.payload;
    const receiverSckt = server.openSockets.get(payload.receiver);
    const issuerSckt = server.openSockets.get(payload.issuer);

    // If error is not defined, the send has been completed, otherwise the error
    // object will indicate what failed.
    let receiverSent = new Promise((resolve, reject) => {
        if (receiverSckt != null && receiverSckt.readyState === WebSocket.OPEN) {
            receiverSckt.send(JSON.stringify(obj), function ack(error) {
                if (error != null) {
                    console.log(error)
                    reject(false)
                } else {
                    resolve(true);
                }
            });
        } else {
            reject(false);
        }
    });

    let issuerSent = new Promise((resolve, reject) => {
        if (issuerSckt != null && issuerSckt.readyState === WebSocket.OPEN) {
            issuerSckt.send(JSON.stringify(obj), function ack(error) {
                if (error != null) {
                    console.log(error)
                    reject(false);
                } else {
                    resolve(true);
                }
            });
        }
    });

    return receiverSent.then((result) => {return  result ? issuerSent : Promise.resolve(false)});
}
    /** 
     * obj = {
     * type: 'game',
     * payload: {board: board, issuer: players[0], receiver: players[1], status: 'PLACED_SHIPS'}
     * };
     */
    export function sendReadyState(obj: any) {
        const receiverSckt = server.openSockets.get(obj.payload.receiver.username);
        if (receiverSckt != null && receiverSckt.readyState === WebSocket.OPEN) {
            return new Promise((resolve, reject) => {
                receiverSckt.send(JSON.stringify(obj), function ack(error) {
                    if (error != null) {
                        reject(console.log(error));
                    } else {
                        resolve(true);
                    }
                });
            })
        }
    }
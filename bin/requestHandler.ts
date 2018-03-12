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
    const receiverSckt = server.openSockets.get(obj.receiver);
    const issuerSckt = server.openSockets.get(obj.issuer);
    let receiverSent = false;
    let issuerSent = false;

    // If error is not defined, the send has been completed, otherwise the error
    // object will indicate what failed.
    if (receiverSckt != null && receiverSckt.readyState === WebSocket.OPEN) {
        receiverSckt.send(JSON.stringify({type: 'challenge', payload:obj}), function ack(error) {
            if (typeof error === undefined) {
                receiverSent = true;
            } else {
                console.log(error);
            }
        });
    }
    if (issuerSckt != null && issuerSckt.readyState === WebSocket.OPEN) {
        // TODO send proper format from lobby service
        issuerSckt.send(JSON.stringify({type: 'challenge', payload:obj}), function ack(error) {
            if (typeof error === undefined) {
                issuerSent = true;
            } else {
                console.log(error);
            }
        });
    }
    if (receiverSent && issuerSent)
        return true;
    return false;
}

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

import "reflect-metadata";
import { createConnection, Connection, getConnection, getRepository } from "typeorm";
import { User } from "../entity/User";
const authSecret = '@9O37m1O3ISg';
const saltRounds = 10;



// Input { type: 'login', username: this.username, password: this.password };
export function authUser(body: any) {
    return bcrypt.hash(body.password, saltRounds)
        .then(async function (hash) {
            const repository = getRepository(User);
            const user = await repository.findOne({ username: body.username, pwHash: hash });
            if (user == null) {
                return {};
            }
            else {
                user.pwHash = '';
                console.log('authenticated user:');
                console.dir(user);
                return { type: 'login', payload: user };
            }
        });
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
                // console.log('newly registered user:');
                // console.dir(user);
                return { type: 'register', payload: user };
            } 
        });
}
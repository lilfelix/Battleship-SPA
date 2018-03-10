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

import "reflect-metadata";
import {createConnection, Connection, getConnection} from "typeorm";
import {User} from "../entity/User";

export function authUser() {

}

export function createUser() {
    
}
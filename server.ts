"use strict";
import express from 'express';
import path from "path";
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';
import errorHandler from "errorhandler";
import 'jsonwebtoken';
import debug = require('debug');
import jwt from 'express-jwt';
import WebSocket = require('ws');
import logger = require('morgan');
import "reflect-metadata";
import { router } from './routes';
import * as http from 'http';
import { ServerOptions } from 'https';
import { User } from './entity/User';
import { createConnection, Connection, getConnection, getRepository } from "typeorm";

interface Error {
  status?: number;
  message?: string;
}

/**
 * The server.
 *
 * @class Server
 */
export class Server {

  public app: express.Application;
  public wss: WebSocket.Server;
  public httpServer: http.Server;
  public activeUsers: User[];
  public openSockets: Map<string, WebSocket>;

  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
   */
  public static bootstrap(): Server {
    return new Server();
  }

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor() {
    this.openSockets = new Map();

    //create expressjs application
    this.app = express();
    this.app.set('port', '3000');

    //create websocket server
    const temp = this.httpServer = http.createServer(this.app);
    this.wss = new WebSocket.Server({ server: temp } as WebSocket.ServerOptions);

    //fetch active users
    this.activeUsers = [];

    //configure application
    this.config();

    //add routes
    this.routes();
  }

  /**
   * Configure application
   *
   * @class Server
   * @method config
   */
  public config() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(cookieParser());
    this.app.use(logger('dev'));
  }

  /**
   * Create REST API routes
   *
   * @class Server
   * @method routes 
   */
  public routes() {

    // Static content
    this.app.use('/', express.static(path.join(__dirname, "client/dist/")));

    // Api routes
    this.app.use('/', router);

    // Error handling
    this.app.use(errorHandler());
  }

  // Broadcast to all.
  public broadcast(obj: any) {
    this.wss.clients.forEach(function each(client: any) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(obj));
      }
    });
  }
}

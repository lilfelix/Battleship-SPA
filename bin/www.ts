"use strict";
/**
 * Module dependencies.
 */

import { Server } from '../server';
import debug from 'debug'
import WebSocket = require('ws');
import http from 'http';
import url from 'url';
import "reflect-metadata";
import { createConnection, Connection, getConnection } from "typeorm";
import { User } from "../entity/User";
import { Highscore } from '../entity/Highscore';

/**
 * Connect to database
 */
createConnection().then(async connection => {

  const user1 = new User();
  user1.username = "bob";
  user1.name = "Robert Doe";
  user1.pwHash = '$2a$10$3Clua6AvGsqGgD8mego02u2Rye5j2yu1S1AAmDx0OaiahjnDI6102';
  const user2 = new User();
  user2.username = "alice";
  user2.name = "Alice Moe";
  user2.pwHash = '$2a$10$3Clua6AvGsqGgD8mego02u2Rye5j2yu1S1AAmDx0OaiahjnDI6102';
  const highscore1 = new Highscore();
  highscore1.user =  user1;
  highscore1.numGames = 10;
  highscore1.numWon = 0;
  highscore1.numLost = 10;
  const highscore2 = new Highscore();
  highscore2.user = user2;
  highscore2.numGames = 8;
  highscore2.numWon = 5;
  highscore2.numLost = 3;

  await connection.manager.save([user1, user2, highscore1, highscore2]);
  const users = await connection.manager.find(User);
}).catch(error => console.log(error))

export const server = Server.bootstrap();
const app = server.app;
const wss = server.wss;
const httpServer = server.httpServer;
const port = 3000;

// Expect username to be part of incoming client connection request
wss.on('connection', function connection(ws: WebSocket, req: http.IncomingMessage) {
  let location: any;
  if (req.url != null) {
    location = url.parse(req.url, true).query;
    console.log('New client connected over websocket: ' + location.username);
    server.openSockets.set(location.username, ws);
  }

  ws.on('message', function incoming(message: any) {
    console.log('received: %s', message);
  });

  ws.on('close', function close() {
    server.activeUsers.filter(usr => usr.username !== location.username);
    server.openSockets.delete(location.username);
    return ws.terminate();
  });

  ws.on('error', () => console.log('errored'));
});

// Listen on provided port, on all network interfaces.
httpServer.listen(port);
httpServer.on('error', onError);
httpServer.on('listening', onListening);
console.log('Server listening on port: ' + port);


// Event listener for HTTP server "error" event.
function onError(error: any) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// Event listener for HTTP server "listening" event.
function onListening() {
  var addr = httpServer.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

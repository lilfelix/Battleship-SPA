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

/**
 * Connect to database
 */
createConnection().then(async connection => {

    console.log("Inserting a new user into the database...");
    const user = new User();
    user.username = "jodo";
    user.name = "John Doe";
    await connection.manager.save(user);
    console.log("Saved a new user with id: " + user.id);
    
    console.log("Loading users from the database...");
    const users = await connection.manager.find(User);
    console.log("Loaded users: ", users);
     
    // console.log("Here you can setup and run express/koa/any other framework.");
    
}).catch(error => console.log(error)) 

/** 
 * Custom class for websocket server to facilitate broadcasting
*/
export class CustomServer {

  wss : WebSocket.Server;

  constructor(serverOptions: WebSocket.ServerOptions | undefined) {
    this.wss = new WebSocket.Server(serverOptions);
  }

  // Broadcast to all.
  broadcast = (data: any) => {
    this.wss.clients.forEach(function each(client: any) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });

  }
}

// Get port from environment and store in Express.
const port = normalizePort(process.env.PORT || '3000');
const app = Server.Server.bootstrap().app;
app.set('port', port);

// Create HTTP server.
const server = http.createServer(app);

// Wrap server in Websocket Server 
const customServer = new CustomServer({server});
const wss = customServer.wss;

wss.on('connection', function connection(ws: WebSocket, req: http.IncomingMessage) {
  let location;
  if (req.url != null)
    location = url.parse(req.url, true);

  ws.on('message', function incoming(message: any) {
    console.log('received: %s', message);
  });

  ws.on('close', function close() {
    return ws.terminate();
  });

  ws.on('error', () => console.log('errored'));
});

// Listen on provided port, on all network interfaces.
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
console.log('Server listening on port: ' + port);

// Normalize a port into a number, string, or false.
function normalizePort(val: any) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

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
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

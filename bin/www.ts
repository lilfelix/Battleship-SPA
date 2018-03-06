
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

/** 
 * Wrap websocket server in custom class to enable broadcasting
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

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000');
const app = Server.Server.bootstrap().app;
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Wrap server in Websocket Server and declare it as global
 */

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

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
console.log('Server listening on port: ' + port);

/**
 * Normalize a port into a number, string, or false.
 */

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

/**
 * Event listener for HTTP server "error" event.
 */

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

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}



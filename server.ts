import express from 'express';
import path from "path";
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';
import errorHandler from "errorhandler";
import 'jsonwebtoken';
import jwt from 'express-jwt';
import "reflect-metadata";
// const apii: express.Router = require('./routes');
import { router } from './routes';

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
    //create expressjs application
    this.app = express();

    //configure application
    this.config();

    //add routes
    this.routes();

    //add api
    this.api();
  }

  /**
   * Create REST API routes
   *
   * @class Server
   * @method api
   */
  public api() {
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
  }

  /**
   * Create router
   *
   * @class Server
   * @method api
   */
  public routes() {

    // Static content
    this.app.use('/', express.static(path.join(__dirname, "client/dist/")));

    // Api routes
    this.app.use('/', router);

    // Error handling
    this.app.use(errorHandler());
  }
}
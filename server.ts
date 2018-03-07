import * as bodyParser from "body-parser";
import * as path from "path";
import errorHandler = require("errorhandler");
import express = require('express');
import "reflect-metadata";
const jwt = require('jwt-express');

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
    //empty for now
  }

  /**
   * Configure application
   *
   * @class Server
   * @method config
   */
  public config() {

    //add static paths
    this.app.use(express.static(path.join(__dirname, "client/src/")));

    //use json form parser middlware
    this.app.use(bodyParser.json());

    //use query string parser middlware
    this.app.use(bodyParser.urlencoded({
      extended: true
    }));

    // Initialize Jason Web Token middleware with secret
    this.app.use(jwt.init('E#38w85!Swu40g9a^mdM6GlQ'))

    //catch 404 and forward to error handler
    this.app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
      err.status = 404;
      next(err);
    });

    //error handling
    this.app.use(errorHandler());
  }

  /**
   * Create router
   *
   * @class Server
   * @method api
   */
  public routes() {
    // catch 404 and forward to error handler
    this.app.use(function (req: express.Request, res: express.Response, next: express.NextFunction) {
      const err: Error = new Error('Not Found');
      err.status = 404;
      next(err);
    });

    // error handler
    this.app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render('error');
    })
  }
}
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import express = require('express');
interface Error {
  status?: number;
  message?: string;
}
import * as path from "path";

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
    //empty for now
  }

  /**
   * Create router
   *
   * @class Server
   * @method api
   */
  public routes() {
    // catch 404 and forward to error handler
    this.app.use(function (req: express.Request, res:express.Response, next:express.NextFunction) {
      const err: Error = new Error('Not Found');
      err.status = 404;
      next(err);
    });

    // error handler
    this.app.use((err:Error, req:express.Request, res:express.Response,next:express.NextFunction) => {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render('error');
    })
  }
}
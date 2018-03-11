import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';

@Injectable()
export class WebsocketService {

  // TODO socket handles login, game and chat objects
  public socket$: WebSocketSubject<any>;
  private serverData: any[] = [];

  constructor(
    // private gameService: GameService,
    ) {
    this.socket$ = WebSocketSubject.create('ws://localhost:3000');

    this.socket$
      .subscribe(
        (message) => { // message is a JSON object
          this.serverData.push(message);
          console.log('websocketservice received from server: '); // obj.message);
          console.dir(message);
          // const arr = JSON.parse(message);
          message.forEach((object: any) => {
            console.dir(object);
            switch (object.status) {
             default:
                console.log('Unidentified message from websocket:');
                console.dir(message);
            }
          });
        },
        (err) => console.error(err),
        () => console.warn('Completed!')
      );

  }

}


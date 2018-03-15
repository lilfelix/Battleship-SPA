import { Injectable, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';
import { AuthService } from './login/auth.service';
import { User } from './models/User';
import { LobbyService } from './lobby/lobby.service';
import { ChatService } from './chat/chat.service';
import { Subject } from 'rxjs/Subject';
import { Message } from './models/Message';

@Injectable()
export class WebsocketService {

  @Output() gameEventSource = new Subject<any>();
  @Output() lobbyEventSource = new Subject<any>();
  @Output() chatEventSource = new Subject<any>();
  public socket$: WebSocketSubject<any>;
  private serverData: any[] = [];
  public user: User;

  constructor() {}

  openConnection(user: User ) {
    this.user = user;
    console.log('opening web socket for user: ', this.user.username);
    this.socket$ = WebSocketSubject.create('ws://localhost:3000?username=' + this.user.username);

    /**
     * A socket object has format {type:..., payload:...}
     * Socket objects can be of the following types:
     * user: alert that new user has logged in
     * message: message sent to user (private or general)
     * game: a game object (info about an event in current game)
     */
    this.socket$.subscribe(
      (object) => {
        this.serverData.push(object);
        // console.log('websocketservice received from server: ', object);
        switch (object.type) {
          case 'user':
            console.log('sending eventsource from wsService');
            this.lobbyEventSource.next({ status: 'NEW_USER', payload: object.payload });
            break;
          case 'challenge':
            this.lobbyEventSource.next({ status: 'CHALLENGE', payload: object.payload });
            break;
          case 'message':
            this.chatEventSource.next(object.payload as Message);
            break;
          case 'game':
            this.gameEventSource.next(object.payload);
            break;
          default:
            console.log('Unidentified object from websocket:');
            console.dir(object);
        }
      },
      (err) => console.error(err),
      () => console.warn('Completed!')
    );
  }

}


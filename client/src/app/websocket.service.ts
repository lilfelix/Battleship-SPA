import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject';
import { AuthService } from './login/login.service';
import { User } from './models/User';
import { LobbyService } from './lobby/lobby.service';

@Injectable()
export class WebsocketService {

  // TODO socket handles login, game and chat objects
  public socket$: WebSocketSubject<any>;
  private serverData: any[] = [];
  public user: User;

  // The singleton WebsocketService is the last service to be injected, ensuring it can access authService.user
  constructor(private authService: AuthService, private lobbyService: LobbyService) {
    this.user = this.authService.user;
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
        console.log('websocketservice received from server: ', object);
        switch (object.type) {
          case 'user':
            this.lobbyService.displayNewUser(object.payload);
            break;
          case 'challenge':
            this.lobbyService.displayChallenge(object.payload);
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


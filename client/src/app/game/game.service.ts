import { Injectable, Output } from '@angular/core';
import { Board } from '../models/Board';
import { User } from '../models/User';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { handleError } from '../httpError';
import { HttpService } from '../http.service';
import { Subscription } from 'rxjs/Subscription';
import { WebsocketService } from '../websocket.service';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class GameService {

  private readyURL = 'ready';
  private gameEventSubscription: Subscription;
  public clientReady = false;
  public opponentReady = false;
  public gameStarted = false;
  public clientBoard: Board;
  public opponentBoard: Board;
  public clientStarts: boolean; // true if client shoots first after ships have been placed
  public finished: boolean;
  public players: User[];
  @Output() gameEventSource = new Subject<any>();


  constructor(private http: HttpService, private wsService: WebsocketService) { }

  listenWebSocket() {
    this.wsService.gameEventSource
      .subscribe((event: any) => {
        this.parseGameEvent(event);
      });
  }

  // notify server and opponent that this client is ready to play (ships placed on board)
  sendReadyState(board: Board, players: User[]) {
    const obj = { type: 'game', payload: { board: board, from: players[0], to: players[1], status: 'PLACED_SHIPS' } };
    return this.http.post(this.readyURL, obj, 'sendReadyState')
    .subscribe((result) => {
      result.success ? console.log('readyState sent successfully') : console.log('readyState failed to send');
      if (result.success) {
        this.clientReady = true;
        if (this.opponentReady && this.clientStarts) {
        this.gameEventSource.next('SHOOT');
        }
      } else {
        alert('Error: could not set board. Try again');
      }
    });

  }

  parseGameEvent(event) {
    switch (event.status) {
      case 'PLACED_SHIPS':
        this.opponentBoard = event.board;
        this.opponentReady = true;
        if (this.clientReady) {
          if (this.clientStarts) {
            this.gameEventSource.next('SHOOT');
          }
        }
        break;
      case 'TORPEDO_FIRED':
        break;
      case 'WIN':
        break;
      case 'DEFEAT':
        break;
      case 'INTERRUPT':
        break;
    }
  }
}

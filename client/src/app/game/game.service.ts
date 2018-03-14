import { Injectable, Output } from '@angular/core';
import { Board } from '../models/Board';
import { User } from '../models/User';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { handleError } from '../httpError';
import { HttpService } from '../http.service';
import { Subscription } from 'rxjs/Subscription';
import { WebsocketService } from '../websocket.service';

@Injectable()
export class GameService {

  private readyURL = 'ready';
  private gameEventSubscription: Subscription;
  private options = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  public clientReady = false;
  public opponentReady = false;
  public gameStarted = false;
  public clientBoard: Board;
  public opponentBoard: Board;
  public starts: boolean; // true if client shoots first after ships have been placed
  public finished: boolean;
  public players: User[];


  constructor(private http: HttpService, private wsService: WebsocketService) { }

  listenWebSocket() {
    this.wsService.gameEventSource
      .subscribe((event: any) => {
        this.parseGameEvent(event);
      });
  }

  // notify server and opponent that this client is ready to play (ships placed on board)
  sendReadyState(board: Board, players: User[]) {
    if (this.opponentReady) {
      this.gameStarted = true;
    }
    const obj = { type: 'game', payload: { board: board, from: players[0], to: players[1], status: 'PLACED_SHIPS' } };
    return this.http.post(this.readyURL, obj, 'sendReadyState');
  }

  parseGameEvent(event) {
    switch (event.status) {
      case 'PLACED_SHIPS':
        this.opponentBoard = event.board;
        this.opponentReady = true;
        if (this.clientReady) {
          this.gameStarted = true;
        }
        break;
      case 'TORPEDO_FIRED':
        break;
      case 'WIN':
        break;
      case 'LOSE':
        break;
    }
  }
}

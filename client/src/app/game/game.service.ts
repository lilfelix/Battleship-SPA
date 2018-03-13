import { Injectable } from '@angular/core';
import { Board } from '../models/Board';
import { User } from '../models/User';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { handleError } from '../httpError';
import { HttpService } from '../http.service';

@Injectable()
export class GameService {

  private readyURL = 'ready';
  private options = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpService) { }

  // notify server and opponent that this client is ready to play (ships placed on board)
  sendReadyState(board: Board, players: User[]) {
    const obj = {type: 'game', payload: {board: board, from: players[0], to: players[1], status: 'shipsPlaced'}};
    return this.http.post(this.readyURL, obj, 'sendReadyState');
  }
}

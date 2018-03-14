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
import { Tile } from '../models/Tile';

@Injectable()
export class GameService {

  private readyURL = 'ready';
  private torpedoURL = 'torpedo';
  public clientReady = false;
  public opponentReady = false;
  public gameStarted = false; // TODO remove
  public clientStarts: boolean; // true if client shoots first after ships have been placed
  public finished: boolean;
  public players: User[];
  public boards: Board[];
  private gameEventSubscription: Subscription; // Subscribe to incoming events via websocket
  @Output() gameEventSource = new Subject<any>(); // Issue events to game/board component


  constructor(private http: HttpService, private wsService: WebsocketService) { }

  listenWebSocket() {
    this.wsService.gameEventSource
      .subscribe((event: any) => {
        this.processGameEvent(event);
      });
  }

  // notify server and opponent that this client is ready to play (ships placed on board)
  sendReadyState(board: Board, players: User[]) {
    const obj = {
      type: 'game',
      payload: { board: board, issuer: players[0].username, receiver: players[1].username, status: 'PLACED_SHIPS' }
    };
    return this.http.post(this.readyURL, obj, 'sendReadyState')
      .subscribe((result) => {
        result.success ? console.log('readyState sent successfully') : console.log('readyState failed to send');
        if (result.success) {
          this.clientReady = true;
          if (this.opponentReady) {
            if (this.clientStarts) {
              this.gameEventSource.next('SHOOT');
            } else {
              this.gameEventSource.next('WAIT');
            }
          }
        } else {
          alert('Error: could not set board. Try again');
        }
      });

  }

  processGameEvent(event: any) {
    switch (event.status) {
      case 'PLACED_SHIPS':
        console.log('before hiding', event.board);
        const opponentBoard: Board = event.board;
        opponentBoard.id = 2;
        this.hideShips(opponentBoard);
        console.log('after hiding', opponentBoard);
        this.boards[1] = opponentBoard;
        this.opponentReady = true;
        if (this.clientReady) {
          if (this.clientStarts) {
            this.gameEventSource.next('SHOOT');
          } else {
            this.gameEventSource.next('WAIT');
          }
        }
        break;
      case 'TORPEDO_FIRED':
        this.checkHit(event.tile, true);
        this.gameEventSource.next('SHOOT');
        break;
      case 'WIN':
        break;
      case 'DEFEAT':
        break;
      case 'INTERRUPT':
        break;
    }
  }

  hideShips(board: Board) {
    for (let i = 0; i < board.size; i++) {
      for (let j = 0; j < board.size; j++) {
        const t: Tile = board.tiles[i][j];
        Tile.hide(t);
      }
    }
  }

  sendTorpedo(tile: Tile) {
    const obj = {
      type: 'game',
      payload: { tile: tile, issuer: this.players[0].username, receiver: this.players[1].username, status: 'TORPEDO_FIRED' }
    };
    return this.http.post(this.torpedoURL, obj, 'sendTorpedo')
      .subscribe((result) => {
        result.success ? console.log('torpedo sent successfully') : console.log('torpedo failed to send');
        if (result.success) {
          this.gameEventSource.next('WAIT');
        } else {
          alert('Error: could not drop bomb. Try again');
        }
      });
  }

  checkHit(tile: Tile, clientBoard: boolean) {
    if (clientBoard) {
      if (tile.used) {
        Tile.setTileStyles(tile, true, true);
        if (this.boards[1].totalNumShips === 1) {
          this.finished = true;
          this.gameEventSource.next('WIN');
        } else {
          this.boards[1].totalNumShips--;
        }
      }
    } else {
      if (tile.used) {
        Tile.setTileStyles(tile, true, true);
        if (this.boards[0].totalNumShips === 1) {
          this.finished = true;
          this.gameEventSource.next('DEFEAT');
        } else {
          this.boards[0].totalNumShips--;
        }
      }
    }
  }
}

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
import { Highscore } from '../models/Highscore';
import { LobbyService } from '../lobby/lobby.service';

@Injectable()
export class GameService {

  private readyURL = 'ready';
  private torpedoURL = 'torpedo';
  public clientReady = false;
  public opponentReady = false;
  public clientStarts: boolean; // true if client shoots first after ships have been placed
  public activeGame = false; // TODO remove
  public gameOver = false;
  public matchFound = false;
  public players: User[];
  public boards: Board[];
  public highscoreEntries: Highscore[];
  private activeGameSubscription: Subscription; // Subscribe to lobby initializing new games
  @Output() gameEventSource = new Subject<any>(); // Issue events to game/board component
  @Output() highscoreEventSource = new Subject<Highscore[]>(); // Issue events to game/board component


  constructor(private http: HttpService, private wsService: WebsocketService) { }

  getHighscores() {
    return this.http.get('highscore', 'getHighscore')
      .subscribe((entries: Highscore[]) => {
        this.highscoreEntries = entries;
        this.highscoreEventSource.next(entries);
        console.log('fetched highscore', entries);
      });
  }

  listenWebSocket() {
    this.wsService.gameEventSource
      .subscribe((event: any) => {
        this.processGameEvent(event);
      });
    this.wsService.highscoreEventSource
      .subscribe((entry: Highscore) => {
        this.processHighscoreEvent(entry);
      });
  }

  initGame(user: User, opponent: User, clientStarts: boolean) {
    this.clientStarts = clientStarts;
    this.players = [user, opponent];
    this.activeGame = true;
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
            // Both players have placed ships
            this.gameEventSource.next('START');
            if (this.clientStarts) {
              this.gameEventSource.next('SHOOT');
            } else {
              this.gameEventSource.next('WAIT');
            }
          } else {
            // Wait until opponent has placed ships
            this.gameEventSource.next('WAIT');
          }
        } else {
          alert('Error: could not set board. Try again');
        }
      });

  }

  // Game event received over web socket
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
          this.gameEventSource.next('START');
          if (this.clientStarts) {
            this.gameEventSource.next('SHOOT');
          } else {
            this.gameEventSource.next('WAIT');
          }
        }
        break;
      case 'TORPEDO_FIRED':
        if (!this.gameOver) {
          this.checkHit(event.tile, true);
        }
        break;
      case 'INTERRUPT':
        this.gameEventSource.next('INTERRUPT');
        break;
    }
  }

  processHighscoreEvent(entry: Highscore) {
    const matchingEntries = this.highscoreEntries.filter(e => e.id === entry.id);
    if (matchingEntries === []) {
      this.highscoreEntries.push(entry);
    } else {
      const oldEntry = matchingEntries[0];
      const index = this.highscoreEntries.indexOf(oldEntry);
      this.highscoreEntries.splice(index, 1, entry);
    }
    this.highscoreEventSource.next(this.highscoreEntries);
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
        if (!result.success) {
          alert('Error: could not drop bomb. Try again');
        }
      });
  }

  checkHit(tile: Tile, clientBoard: boolean) {
    if (tile.hit) {
      // Dropping bombs on this tile again won't yield a result
      if (clientBoard) {
        this.boards[1].bombsDropped++;
        this.gameEventSource.next('SHOOT');
      } else {
        this.boards[0].bombsDropped++;
        this.gameEventSource.next('WAIT');
      }
      return;
    }
    if (clientBoard) {
      // Bomb dropped on client's board
      this.boards[1].bombsDropped++;
      if (tile.used) {
        // Bomb hit a ship
        this.boards[1].score++;
        this.boards[0].totalNumShips--;
        Tile.setTileStyles(tile, true, true);
        if (this.boards[0].totalNumShips === 0) {
          this.gameOver = true;
          this.gameEventSource.next('DEFEAT');
          this.updateClientHighscore('DEFEAT');
        } else {
          // Opponent gets to shoot again on hit
          this.gameEventSource.next('WAIT');
        }
      } else {
        // Change to client's turn on opponent miss
        Tile.setTileStyles(tile, false, true);
        this.gameEventSource.next('SHOOT');
      }
    } else {
      // Bomb dropped on opponent's board
      this.boards[0].bombsDropped++;
      if (tile.used) {
        // Bomb hit a ship
        this.boards[0].score++;
        this.boards[1].totalNumShips--;
        Tile.setTileStyles(tile, true, true);
        if (this.boards[1].totalNumShips === 0) {
          this.gameOver = true;
          this.gameEventSource.next('WIN');
          this.updateClientHighscore('WIN');
        } else {
          // Client gets to shoot again on hit
          this.gameEventSource.next('SHOOT');
        }
      } else {
        // Change to opponents turn on client miss
        Tile.setTileStyles(tile, false, true);
        this.gameEventSource.next('WAIT');
      }
    }
  }

  // Update highscore on client and on server after game has ended
  updateClientHighscore(outcome: string) {
    console.log('sending HS from updateClientHighscore');
    const entry = this.highscoreEntries.filter(h => h.user.username === this.players[0].username)[0];
    entry.numGames++;
    if (outcome === 'WIN') {
      entry.numWon++;
    } else if (outcome === 'DEFEAT') {
      entry.numLost++;
    }
    this.http.post('highscore', entry, 'updateClientHighscore')
      .subscribe((result: any) => {
        result.success ? console.log('highscore sent successfully') : console.log('highscore failed to send');
      });
  }
}

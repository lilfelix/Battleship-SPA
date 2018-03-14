import { Injectable, Output, EventEmitter, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { handleError } from '../httpError';
import { User } from '../models/User';
import { Challenge } from '../models/Challenge';
import { AuthService } from '../login/auth.service';
import { Router } from '@angular/router';
import { HttpService } from '../http.service';
import { WebsocketService } from '../websocket.service';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class LobbyService {

  private activeUsersURL = 'active';
  private challengeURL = 'challenge';
  public user: User;
  public opponent: User;
  public starts: boolean;
  @Output() processChallengeSource = new Subject<Challenge>();
  @Output() displayUserSource = new Subject<User>();
  @Output() gameEventSource = new Subject<any>();
  lobbyEventSubscription: Subscription;
  setUserSubscription: Subscription;


  constructor(
    private http: HttpService,
    private authService: AuthService,
    private router: Router,
    private wsService: WebsocketService
  ) {
    this.opponent = new User();
    this.opponent.username = 'None';

    this.user = this.authService.user;
    this.setUserSubscription = this.authService.setUserSource
    .subscribe((user: User) => {
      this.user = user;
    });

    this.lobbyEventSubscription = this.wsService.lobbyEventSource
      .subscribe((event: any) => {
        this.processLobbyEvent(event);
      });
  }

  processLobbyEvent(event: any) {
    console.log('processlobbyevent:', event);
    switch (event.status) {
      // New user logged in. Update list in lobby
      case 'NEW_USER':
        this.displayUserSource.next(event.payload as User);
        break;
      case 'CHALLENGE':
        this.processChallengeSource.next(event.payload as Challenge);
        break;
      default:
        console.log('Error: unknown lobby event');
    }
  }

  // GET available players from server
  getActiveUsers(): Observable<User[]> {
    return this.http.get(this.activeUsersURL, 'getActiveUsers');
  }

  // Send challenge event to server so it can be forwarded to receiver
  sendChallengeEvent(challenge: Challenge, status: string, successMsg: string, errMsg: string) {
    const obj = { type: 'challenge', payload: { issuer: challenge.issuer, receiver: challenge.receiver, status: status } };
    this.http.post(this.challengeURL, obj, 'sendChallenge')
      .subscribe((result) => {
        result.success ? console.log(successMsg + challenge.receiver) : console.log(errMsg + challenge.receiver);
      });
    if (status = 'accept') {
      this.starts = false;
    }
  }

  initGame(user: User, opponent: User, starts: boolean) {
    this.starts = starts;
    this.opponent = opponent;
    this.gameEventSource.next(true);
    this.router.navigate(['game']);
  }
  // Returns the users participating in a game that is being initialized
  getPlayers() {
    return [this.user, this.opponent];
  }
}

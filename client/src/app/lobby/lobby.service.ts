import { Injectable, Output, EventEmitter } from '@angular/core';
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

@Injectable()
export class LobbyService {

  private activeUsersURL = 'active';
  private challengeURL = 'challenge';
  public user: User;
  public opponent: User;
  @Output() processChallengeSource = new Subject<Challenge>();
  @Output() displayUserSource = new Subject<User>();

  constructor(private http: HttpService, private authService: AuthService, private router: Router) {
    this.user = authService.user;
    this.opponent = new User();
    this.opponent.username = 'None';
  }

  // GET available players from server
  getActiveUsers(): Observable<User[]> {
    return this.http.get(this.activeUsersURL, 'getActiveUsers');
  }

  // New challenge received on websocket. Display to user
  processChallenge(challenge: Challenge) {
    this.processChallengeSource.next(challenge);
  }

  // Send challenge to server so it can be forwarded to receiver
 sendChallenge(challenge: Challenge, status: string, successMsg: string, errMsg: string) {
  const obj = { type: 'challenge', payload: { issuer: challenge.issuer, receiver: challenge.receiver, status: status } };
    this.http.post(this.challengeURL, obj, 'sendChallenge')
    .subscribe((result) => {
      result.success ? console.log(successMsg + challenge.receiver) : console.log(errMsg + challenge.receiver);
    });
  }

  // New user logged in. Update list in lobby
  displayUser(user: User) {
    this.displayUserSource.next(user);
  }

  initGame(user: User, opponent: User) {
    this.opponent = opponent;
    this.router.navigate(['game']);
  }
  // Returns the users participating in a game that is being initialized
  getPlayers() {
    return [this.user, this.opponent];
  }
}

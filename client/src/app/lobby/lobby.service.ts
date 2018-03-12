import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { handleError } from '../httpError';
import { User } from '../models/User';
import { Challenge } from '../models/Challenge';
import { AuthService } from '../login/login.service';

@Injectable()
export class LobbyService {

  private activeUsersURL = 'active';
  private challengeURL = 'challenge';
  public user: User;
  @Output() displayChallengeSource = new Subject<Challenge>();
  @Output() displayUserSource = new Subject<User>();
  private options = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient, private authService: AuthService) {
    this.user = authService.user;
  }

  // GET available players from server
  getActiveUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.activeUsersURL)
      .pipe(
        catchError(handleError('getActiveUsers', []))
      );
  }

  // Challenge received on websocket is displayed to user
  displayChallenge(challenge: Challenge) {
    this.displayChallengeSource.next(challenge);
  }

  // Send challenge to server so it can be forwarded to receiver
  sendChallenge(challenge: Challenge) {
    return this.http.post<any>(this.challengeURL, JSON.stringify(challenge), this.options)
    .pipe(
      catchError(handleError('sendChallenge', {success: false}))
    );
  }

  // New user logged in. Update list in lobby
  displayNewUser(user: User) {
    this.displayUserSource.next(user);
  }
}

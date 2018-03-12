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

@Injectable()
export class LobbyService {

  private activeUsersURL = 'active';
  private challengeURL = 'challenge';
  public user: User;
  @Output() processChallengeSource = new Subject<Challenge>();
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

  // New challenge received on websocket. Display to user
  processChallenge(challenge: Challenge) {
    this.processChallengeSource.next(challenge);
  }

  // Send challenge to server so it can be forwarded to receiver
  sendChallenge(challengeObj: any) {
    return this.http.post<any>(this.challengeURL, JSON.stringify(challengeObj), this.options)
      .pipe(
        catchError(handleError('sendChallenge', { success: false }))
      );
  }

  // New user logged in. Update list in lobby
  displayUser(user: User) {
    this.displayUserSource.next(user);
  }
}

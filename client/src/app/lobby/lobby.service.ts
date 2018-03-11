import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { handleError } from '../httpError';
import { User } from '../models/User';
import { Challenge } from '../models/Challenge';

@Injectable()
export class LobbyService {

  private activeUsersURL = 'active';
  @Output() displayChallengeSource = new Subject<Challenge>();
  @Output() displayUserSource = new Subject<User>();

  constructor(private http: HttpClient) { }

  // GET available players from server
  getActiveUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.activeUsersURL)
      .pipe(
        catchError(handleError('getActiveUsers', []))
      );
  }

  // Challenge received on websocket is displayed to user
  forwardChallenge(challenge: Challenge) {
    this.displayChallengeSource.next(challenge);
  }

  // New user logged in. Update list in lobby
  displayNewUser(user: User) {
    this.displayUserSource.next(user);
  }
}

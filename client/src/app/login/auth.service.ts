import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { handleError } from '../httpError';
import { User } from '../models/User';
import { AuthResponse } from '../models/AuthResponse';

@Injectable()
export class AuthService {

  private authUrl = 'auth';
  public user: User;
  @Output() setUserSource = new Subject<User>();

  constructor(private http: HttpClient) {
    this.user = new User();
    this.user.username = 'Guest';
  }

  // Authenticate existing or newly registered user (type property in autObj differs)
  authUser(authObj: any): Observable<AuthResponse> {
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.post<AuthResponse>(this.authUrl, JSON.stringify(authObj), options)
    .pipe(
      catchError(handleError('authUser', {type: authObj.type, payload: {}, token: ''}))
    );
  }

  setUser(user: User) {
    this.user = user;
    this.setUserSource.next(user);
  }
}

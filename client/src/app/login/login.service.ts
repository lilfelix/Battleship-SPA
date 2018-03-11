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
  @Output() setUserSource = new Subject<User>();

  constructor(private http: HttpClient) { }

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
    this.setUserSource.next(user);
  }
}

import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { handleError } from '../httpError';
import { User } from '../models/User';
import { AuthResponse } from '../models/AuthResponse';
import { HttpService } from '../http.service';
import { WebsocketService } from '../websocket.service';

@Injectable()
export class AuthService {

  private authUrl = 'auth';
  public user: User;
  @Output() setUserSource = new Subject<User>();

  constructor(private http: HttpService, private wsService: WebsocketService) {
    this.user = new User();
    this.user.username = 'Guest';
  }

  // Authenticate existing or newly registered user (type property in autObj differs)
  authUser(authObj: any): Observable<AuthResponse> {
   return this.http.post(this.authUrl, authObj, 'authUser');
  }

  setUser(user: User) {
    this.user = user;
    this.setUserSource.next(user);
  }

  openWebSocket() {
    this.wsService.openConnection(this.user);
  }

}

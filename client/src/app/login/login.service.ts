import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { handleError } from '../httpError';

@Injectable()
export class LoginService {

  private loginUrl = 'login';

  constructor(private http: HttpClient) { }

  requestLogin(loginObj: any): Observable<any> {
    return this.http.get<any>(this.loginUrl)
      .pipe(
        catchError(handleError('requestLogin', { status: 'failed' }))
      );
  }
}

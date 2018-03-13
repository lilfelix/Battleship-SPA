import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { handleError } from './httpError';

@Injectable()
export class HttpService {

  private options = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private http: HttpClient) { }

  post(url: string, obj: any, errMsg: string) {
    return this.http.post<any>(url, JSON.stringify(obj), this.options)
    .pipe(
      catchError(handleError(errMsg, { success: false }))
    );
  }

  get(url: string, errMsg: string) {
    return this.http.get<any>(url)
    .pipe(
      catchError(handleError(errMsg, { success: false}))
    );
  }
}

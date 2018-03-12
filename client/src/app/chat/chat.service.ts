import { Injectable, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { handleError } from '../httpError';
import { Subject } from 'rxjs/Subject';
import { Message } from '../models/Message';

@Injectable()
export class ChatService {

  private messageURL = 'message';
  @Output() displayMessageSource = new Subject<Message>();
  private options = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  sendMsg(chatObj: any) {
    return this.http.post<any>(this.messageURL, JSON.stringify(chatObj), this.options)
    .pipe(
      catchError(handleError('sendMsg', {success: false}))
    );
  }

    // New user logged in. Update list in lobby
    displayMessage(msg: Message) {
      this.displayMessageSource.next(msg);
    }
}

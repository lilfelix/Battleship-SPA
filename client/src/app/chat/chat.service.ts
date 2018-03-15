import { Injectable, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { handleError } from '../httpError';
import { Subject } from 'rxjs/Subject';
import { Message } from '../models/Message';
import { Subscription } from 'rxjs/Subscription';
import { WebsocketService } from '../websocket.service';

@Injectable()
export class ChatService {

  private messageURL = 'message';
  public messages: Message[] = [];
  private chatEventSubscription: Subscription;
  private options = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient, private wsService: WebsocketService) {
    // Subscribe to displaying incoming messages
    this.wsService.chatEventSource
      .subscribe((msg) => { this.messages.push(msg); });
   }

  sendMsg(chatObj: any) {
    return this.http.post<any>(this.messageURL, JSON.stringify(chatObj), this.options)
      .pipe(
        catchError(handleError('sendMsg', { success: false }))
      );
  }
}

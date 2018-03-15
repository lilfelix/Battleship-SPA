import { Injectable, Output } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { handleError } from '../httpError';
import { Subject } from 'rxjs/Subject';
import { Message } from '../models/Message';
import { Subscription } from 'rxjs/Subscription';
import { WebsocketService } from '../websocket.service';
import { HttpService } from '../http.service';

@Injectable()
export class ChatService {

  private messageURL = 'message';
  public messages: Message[];
  private chatEventSubscription: Subscription;

  constructor(private http: HttpService, private wsService: WebsocketService) { }

  sendMsg(message: Message) {
    this.http.post(this.messageURL, message, 'sendMsg')
      .subscribe((response: any) => {
        response.success ? console.log('message successful!') : console.log('message failed!');
      });
  }

  getMsgs() {
    // Subscribe to displaying incoming messages
    this.wsService.chatEventSource
      .subscribe((msg: Message) => { this.messages.push(msg); });

    this.http.get(this.messageURL, 'getMsgs')
      .subscribe((msgs: Message[]) => {
        msgs.forEach(msg => this.messages.push(msg));
      });
  }
}

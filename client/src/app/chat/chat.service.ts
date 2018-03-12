import { Injectable } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { handleError } from '../httpError';

@Injectable()
export class ChatService {

  private msgURL: 'msg';
  private options = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient, private wsService: WebsocketService) { }

  sendMsg(chatObj: any) {
    return this.http.post<any>(this.msgURL, JSON.stringify(chatObj), this.options)
    .pipe(
      catchError(handleError('sendMsg', {success: false}))
    );
  }
}

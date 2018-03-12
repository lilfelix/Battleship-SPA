import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from './chat.service';
import { User } from '../models/User';
import { Subscription } from 'rxjs/Subscription';
import { Message } from '../models/Message';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  @Input() user: User;
  @Input() users: User[];
  messages: Message[] = [];
  displayMessageSubscription: Subscription;

  constructor(private chatService: ChatService) { }

  ngOnInit() {
    // Subscribe to viewing new users that come online
    this.displayMessageSubscription = this.chatService.displayMessageSource
      .subscribe((msg: Message) => { this.messages.push(msg); });
  }

  onSubmit(msg: string) {
    const chatObj = { type: 'message', payload: { sender: this.user.username, text: msg } };
    this.chatService.sendMsg(chatObj)
      .subscribe((response: any) => {
        response.success ? console.log('message successful!') : console.log('message failed!');
        // TODO save message to chat history
      });
  }
}

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
  message = '';

  constructor(private chatService: ChatService) { }

  ngOnInit() {
    this.chatService.messages = this.messages;
  }

  onSubmit() {
    const chatObj = { type: 'message', payload: { sender: this.user.username, text: this.message } };
    this.chatService.sendMsg(chatObj)
      .subscribe((response: any) => {
        response.success ? console.log('message successful!') : console.log('message failed!');
        // TODO save message to chat history
      });
      this.message = '';
  }
}

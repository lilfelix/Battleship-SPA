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
  msgText = '';

  constructor(private chatService: ChatService) { }

  ngOnInit() {
    // Refer to the message list in chat service
    this.chatService.messages = this.messages;

    // Load message history from server
    this.chatService.getMsgs();
  }

  onSubmit() {
    const msg = new Message(this.user, this.msgText);
    this.chatService.sendMsg(msg);
    this.msgText = '';
  }
}

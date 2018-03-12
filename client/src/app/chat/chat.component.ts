import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from './chat.service';
import { User } from '../models/User';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  @Input() user: User;
  @Input() users: User[];
  constructor(private chatService: ChatService) { }

  ngOnInit() {
  }

  onSubmit(msg: string) {
    const chatObj = {type: 'chat', sender: this.user.username, text: msg };
    this.chatService.sendMsg(chatObj)
      .subscribe((response: any) => {
          response.success ? console.log('message successful!') : console.log('message failed!');
          // TODO save message to chat history
      });
  }
}

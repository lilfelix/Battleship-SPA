import { Component, OnInit, Input } from '@angular/core';
import { User } from './models/User';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from './login/login.service';
import { WebsocketService } from './websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Battleship';
  public user: User;
  status = 'User: Guest';
  setUserSubscription: Subscription;
  private wsService: WebsocketService;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.setUserSubscription = this.authService.setUserSource
    .subscribe((user: User) => { this.setUser(user); });
  }

  setUser(user: User) {
    this.user = user;
    this.status = 'User: ' + this.user.username;
    this.wsService = new WebsocketService(this.user.username);
  }
}

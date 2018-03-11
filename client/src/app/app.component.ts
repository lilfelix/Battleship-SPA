import { Component, OnInit, Input } from '@angular/core';
import { User } from './models/User';
import { Subscription } from 'rxjs/Subscription';
import { LoginService } from './login/login.service';

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

  constructor(private loginService: LoginService) {}

  ngOnInit() {
    this.setUserSubscription = this.loginService.setUserSource
    .subscribe((user: User) => { this.setUser(user); });
  }

  setUser(user: User) {
    this.user = user;
    this.status = 'User: ' + this.user.username;
  }
}

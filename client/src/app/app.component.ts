import { Component, OnInit, Input, HostListener, OnDestroy, Output } from '@angular/core';
import { User } from './models/User';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from './login/auth.service';
import { WebsocketService } from './websocket.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LobbyService } from './lobby/lobby.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title = 'Battleship';
  public user: User;
  public status = 'User: Guest';
  public setUserSubscription: Subscription;
  public gameStarted = false;
  @Output() loggedIn = false;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.user = this.authService.user;
    this.setUserSubscription = this.authService.setUserSource
      .subscribe((user: User) => {
        this.user = user;
        this.status = 'User: ' + this.user.username;
        this.loggedIn = true;
      });
  }
}

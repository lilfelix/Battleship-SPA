import { Component, OnInit, Input, HostListener } from '@angular/core';
import { User } from './models/User';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from './login/auth.service';
import { WebsocketService } from './websocket.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LobbyService } from './lobby/lobby.service';

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
  gameEventSubscription: Subscription;
  public loggedIn = false;
  public gameStarted = false;

  constructor(private authService: AuthService, private lobbyService: LobbyService) {
  }

  ngOnInit() {
    this.user = this.authService.user;
    this.setUserSubscription = this.authService.setUserSource
      .subscribe((user: User) => {
        this.user = user;
        this.status = 'User: ' + this.user.username;
        this.loggedIn = true;
      });

    this.gameEventSubscription = this.lobbyService.gameEventSource
      .subscribe((initiated: boolean) => { this.gameStarted = initiated; });
  }

  @HostListener('window:onbeforeunload', ['$event'])
onBeforeUnload() {
    this.deleteAllCookies();
}

deleteAllCookies() {
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
}

}

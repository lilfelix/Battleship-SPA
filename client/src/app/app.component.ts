import { Component, Input } from '@angular/core';
import { User } from './models/User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Battleship';
  @Input() public user: User;

  setUser(user: User) {
    this.user = user;
  }
}

import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username = '';
  loggedIn = false;

  constructor() { }

  ngOnInit() {
  }

  onEnter(username: string) {
    this.username = username;
    this.loggedIn = true;
  }
}

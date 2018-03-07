import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public username: string;
  private password: string;
  loggedIn = false;

  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
    this.loggedIn = true;
  }
}

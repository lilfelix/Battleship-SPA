import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public username: string;
  private password: string;
  private token: string;
  loggedIn = false;

  constructor(private loginService: LoginService) { }

  ngOnInit() {
  }

  onSubmit() {
    const loginObj = { username: this.username, password: this.password };
    this.loginService.requestLogin(loginObj)
      .subscribe((response: any) => {
        console.dir(response);
        if (response.success === true) {
          this.token = response.token;
          this.loggedIn = true;
          alert('success!');
        } else {
          alert('invalid login!');
        }
      });
  }
}

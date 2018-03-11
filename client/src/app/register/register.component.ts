import { Component, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../login/login.service';
import { User } from '../models/User';
import { AuthResponse } from '../models/AuthResponse';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public username: string;
  public name: string;
  private password: string;
  private passwordRepeat: string;

  constructor(private authService: LoginService) { }

  ngOnInit() {
  }

  onSubmit() {
    const registerObj = { type: 'register', username: this.username, name: this.name, password: this.password };
    this.authService.authUser(registerObj)
      .subscribe((response: AuthResponse) => {
        console.dir(response);
        if (!(Object.keys(response).length === 0)) {
          alert('login successful!');
          this.authService.setUser(response.payload as User);
          // Route to lobby page and set app.component.user to response.payload
        } else {
          alert('login failed!');
          // Route to register page
        }
      });
  }
}

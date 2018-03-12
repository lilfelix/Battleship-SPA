import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { User } from '../models/User';
import { AuthResponse } from '../models/AuthResponse';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public username: string;
  private password: string;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
  }

  onSubmit() {
    const loginObj = { type: 'login', username: this.username, password: this.password };
    this.authService.authUser(loginObj)
      .subscribe((response: AuthResponse) => {
        console.dir(response);
        if (Object.keys(response).length === 0) {
          alert('login failed!');
        } else {
          console.log('login successful!');
          this.authService.setUser(response.payload as User);
          this.router.navigate(['lobby']);
          // Route to lobby page and set app.component.user to response.payload
        }
      });
  }
}

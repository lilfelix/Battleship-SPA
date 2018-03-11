import { Component, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../login/login.service';
import { User } from '../models/User';
import { AuthResponse } from '../models/AuthResponse';
import { Router } from '@angular/router';

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

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
  }

  onSubmit() {
    const registerObj = { type: 'register', username: this.username, name: this.name, password: this.password };
    this.authService.authUser(registerObj)
      .subscribe((response: AuthResponse) => {
        console.dir(response);
        // Route to lobby page and set app.component.user to response.payload
        if (!(Object.keys(response).length === 0)) {
          alert('login successful!');
          this.authService.setUser(response.payload as User);
          this.router.navigate(['lobby']);
        } else {
          alert('login failed!');
          // Route to register page
        }
      });
  }
}

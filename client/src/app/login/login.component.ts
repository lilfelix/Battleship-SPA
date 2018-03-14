import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { User } from '../models/User';
import { AuthResponse } from '../models/AuthResponse';
import { Router, NavigationEnd } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public username: string;
  private password: string;

  constructor(private router: Router, private authService: AuthService, private cookieService: CookieService) { }

  ngOnInit() {
    // When logging out, page is reloaded which in turn triggers login token to be discarded (in AppComponent)
    this.router.events
      .filter((event) => (event instanceof NavigationEnd))
      .subscribe((routeData: any) => {
        if (routeData.urlAfterRedirects === '/login') {
          window.location.reload();
          this.cookieService.delete('token');
        }
      });
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
          this.authService.openWebSocket();
          this.router.navigate(['lobby']);
          // Route to lobby page and set app.component.user to response.payload
        }
      });
  }
}

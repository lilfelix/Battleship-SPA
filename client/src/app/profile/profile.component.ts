import { Component, OnInit } from '@angular/core';
import { User } from '../models/User';
import { HttpService } from '../http.service';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../login/auth.service';
import { WebsocketService } from '../websocket.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  private user: User;
  private profileURL = 'profile';
  private editing = false;
  private setUserSubscription: Subscription;

  constructor(private http: HttpService, private authService: AuthService, private wsService: WebsocketService) { }

  ngOnInit() {
    this.user = this.authService.user;
    this.setUserSubscription = this.authService.setUserSource
    .subscribe((user: User) => {
      this.user = user;
    });

    // Update profile subscription
    this.wsService.profileEventSource
    .subscribe((user: User) => {
      if (user.id === this.user.id) {
        this.authService.setUserSource.next(user);
      }
    });
  }

  onSubmit() {
    this.http.post(this.profileURL, this.user, 'updateProfile')
      .subscribe((result: any) => {
        if (result.success) {
            alert('profile updated successfully!');
          } else {
          alert('Error: failed to update profile!');
        }
      });
      this.editing = false;
  }

  editProfile() {
    this.editing = true;
  }
}

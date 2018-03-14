import { Component, OnInit } from '@angular/core';
import { User } from '../models/User';
import { HttpService } from '../http.service';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../login/auth.service';

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

  constructor(private http: HttpService, private authService: AuthService) { }

  ngOnInit() {
    this.user = this.authService.user;
    this.setUserSubscription = this.authService.setUserSource
    .subscribe((user: User) => {
      this.user = user;
    });
  }

  onSubmit() {
    const profileObj = { type: 'profile', username: this.user.username, name: this.user.name };
    this.http.post(this.profileURL, profileObj, 'updateProfile')
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

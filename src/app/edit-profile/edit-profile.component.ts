import { Component, OnInit } from '@angular/core';
import {AuthService} from "../services/auth.service";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
  ) {
    this.route.queryParams.subscribe(async params => {
      console.log(params.uid);
      if (params.mode === 'signIn' && !!params.uid) {
        console.log('email verification detected!!!');
        const uid = params.uid;
        const userUnverified = await this.userService.getUserUnverifiedByUid(uid);
        if (userUnverified) {
          await this.authService.signUpVerified(userUnverified[0]);
          await this.userService.deleteUserUnverified(uid);
        }
      }
    });
  }

  ngOnInit(): void {
  }

}

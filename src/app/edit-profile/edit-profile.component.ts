import { Component, OnInit } from '@angular/core';
import {AuthService} from "../services/auth.service";
import {UserService} from "../services/user.service";
import {User} from "../models/user";
import {first} from "rxjs/operators";
import {FormControl, Validators} from "@angular/forms";
import {ValidationService} from "../services/validation.service";

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  user: User;
  oriUsername: string;
  editUsername: boolean = false;
  usernameFc: FormControl;
  editGithub: boolean = false;
  githubFc: FormControl;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private validationService: ValidationService
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.user = this.authService.user ?? await this.authService.user$.pipe(first()).toPromise();
    this.oriUsername = this.user?.username;
    this.usernameFc = new FormControl(this.user?.username ?? '', [Validators.required]);
    this.githubFc = new FormControl(this.user?.github_link ?? '', this.validationService.urlValidator());
  }

  toggleEditUsername(): void {
    this.editUsername = !this.editUsername;
  }

  async saveUsername(): Promise<void> {
    console.log(this.user.username);
    if (this.user.username.length) {
      this.toggleEditUsername();
      if (this.oriUsername !== this.user.username) {
        this.oriUsername = this.user.username;
        await this.userService.updateUser(this.user.uid, {username: this.user.username});
      }
    }
  }

  toggleEditGithub(): void {
    this.editGithub = !this.editGithub;
  }

  async saveGithubLink(): Promise<void> {
    if (this.githubFc.valid) {
      this.toggleEditGithub();
      await this.userService.updateUser(this.user.uid, {github_link: this.user.github_link});
    }
  }

}

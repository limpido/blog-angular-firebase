import { Component, OnInit } from '@angular/core';
import {AuthService} from "../services/auth.service";
import {UserService} from "../services/user.service";
import {User} from "../models/user";
import {first} from "rxjs/operators";
import {FormControl, Validators} from "@angular/forms";
import {ValidationService} from "../services/validation.service";
import {AngularFireStorage} from "@angular/fire/compat/storage";

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
  profilePhotoUploadPercentage: number;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private validationService: ValidationService,
    private storage: AngularFireStorage
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

  uploadProfilePhoto(event: any) {
    console.log(event);
    const file = event.target.files[0];
    const uidLast4 = this.user.uid.slice(-4);
    const filePath = `images/profile_photos/${this.user.username}-${uidLast4}/${Date.now()}`;
    const task = this.storage.upload(filePath, file);
    task.percentageChanges().subscribe((percent: number) => {
      this.profilePhotoUploadPercentage = percent;
    });
    task.then(() => {
      this.storage.ref(filePath).getDownloadURL().subscribe(async (downloadURL: string) => {
        this.profilePhotoUploadPercentage = null;
        this.user.profile_pic_url = downloadURL;
        await this.userService.updateUser(this.user.uid, {profile_pic_url: downloadURL});
      })
    });

  }

}

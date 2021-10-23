import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {SignUpModalComponent} from "../modals/sign-up-modal/sign-up-modal.component";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {LogInModalComponent} from "../modals/log-in-modal/log-in-modal.component";
import {User} from "../models/user";
import {UserService} from "../services/user.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {first} from "rxjs/operators";

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {

  user: User;

  constructor(
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {
    const snapshot = this.activatedRoute.snapshot;
    if (snapshot.url[0]?.path === 'sign-up-email-verification' && !!snapshot.queryParams?.email) {
      this.signUpEmailVerified(snapshot.queryParams.email).catch(error => {
        console.error(error);
      });
    }

  }

  async ngOnInit(): Promise<void> {
    this.user = this.authService.user ?? await this.authService.user$.pipe(first()).toPromise();
    console.log(this.user);
    if (this.user?.uid) {
      await this.router.navigate([`${this.user.uid}`]);
    }
  }

  async signUpEmailVerified(email: string): Promise<void> {
    const emailVerifiedMessage = `Congrats! Your email has been verified, you can now log in with your new account!`;
    const emailVerifiedAction = `OK`;
    this.snackBar.open(emailVerifiedMessage, emailVerifiedAction,{duration: 3000});
    await this.authService.signOut();

    const usersUnverified = await this.userService.getUserUnverifiedByEmail(email);
    const userUnverified: User = usersUnverified[0];
    if (userUnverified && userUnverified.uid) {
      await Promise.all([
        this.userService.deleteUserUnverified(userUnverified.uid),
        this.userService.updateUser(userUnverified.uid, {email_verified: true})
      ]);
    }
  }

  signUp(): void {
    const signupModal = this.dialog.open(SignUpModalComponent, {
      width: '400px',
    });

    signupModal.afterClosed().subscribe(async (res) => {
      if (res?.submitted) {
        await this.router.navigate([`/sign-up-verification-email-sent`]);
      }
    });
  }

  logIn(): void {
    const loginModal = this.dialog.open(LogInModalComponent, {
      width: '400px',
    });

    loginModal.afterClosed().subscribe(async user => {
      if (user?.uid) {
        await this.router.navigate([`${user.uid}`]);
      }
    })
  }

}

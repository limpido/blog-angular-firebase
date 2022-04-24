import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import {User} from "../models/user";
import {UserService} from "./user.service";
import {first} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: User;

  constructor(
    private auth: AngularFireAuth,
    private userService: UserService
  ) {}

  async getUser(): Promise<User> {
    return this.auth.authState.pipe(first()).toPromise().then(async (_user) => {
      if (_user) {
        const user = await this.userService.getUserByUid(_user.uid);
        if (user && user?.email_verified) {
          this.user = user;
        }
      } else this.user = null;
      return this.user;
    })
  }

  async signOut(): Promise<void> {
    await this.auth.signOut();
  }

  signUpViaEmailPassword(email: string, password: string): Promise<firebase.auth.UserCredential | void> {
    return this.auth.createUserWithEmailAndPassword(email, password).then(async (userCredential) => {
      await this.sendSignUpVerificationMail(userCredential.user!);
      return userCredential;
    }).catch((err) => {
      console.error(err);
    });
  }

  sendSignUpVerificationMail(user: firebase.User): void {
    const actionCodeSettings: firebase.auth.ActionCodeSettings = {
      url: `https://blog-angular-firebase-feb70.web.app/sign-up-email-verification?email=${user.email}`
    };
    user.sendEmailVerification(actionCodeSettings)
      .then(() => {
        if (user.email) {
          console.log('email sent to ' + user.email);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  signInWithEmailPassword(email: string, password: string): Promise<firebase.User | void> {
    return this.auth.signInWithEmailAndPassword(email, password).then((userCredential) => {
      return userCredential.user;
    }).catch((err) => {
      console.log(err.code);
    });
  }
}

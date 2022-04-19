import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import {User} from "../models/user";
import {UserService} from "./user.service";
import {Observable, of} from "rxjs";
import {map, switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: User;
  user$: Observable<User>;

  constructor(
    private auth: AngularFireAuth,
    private userService: UserService
  ) {
    this.user$ = this.auth.authState.pipe(switchMap(user => {
        if (user) {
          return this.userService.getUserByUid(user.uid);
        } else {
          return of(null);  // Observable<null>
        }
      }),
      map(_user => {
        if (_user?.email_verified) return _user;
        else return null;
      }));
  }

  init() {
    this.user$.subscribe(user => {
      this.user = user;
    });
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
      console.error(err);
    });
  }
}

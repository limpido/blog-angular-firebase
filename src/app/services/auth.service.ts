import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import {User} from "../models/user";
import {UserService} from "./user.service";
import {Observable} from "rxjs";
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
      } else return null;
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

  async signOut() {
    await this.auth.signOut();
  }

  signUpViaEmailPassword(email: string, password: string): Promise<firebase.auth.UserCredential | void> {
    return this.auth.createUserWithEmailAndPassword(email, password).then(async (userCredential) => {
      await this.sendSignUpVerificationMail(userCredential.user!);
      return userCredential;
    }).catch(error => {
      // auth/email-already-in-use
      console.error(error);
    });
  }

  sendSignUpVerificationMail(user: firebase.User) {
    const actionCodeSettings: firebase.auth.ActionCodeSettings = {
      url: `http://localhost:4200/sign-up-email-verification?email=${user.email}`,
      handleCodeInApp: true,
      // iOS: {
      //   bundleId: 'com.example.ios'
      // },
      // android: {
      //   packageName: 'com.example.android',
      //   installApp: true,
      //   minimumVersion: '12'
      // },
      // dynamicLinkDomain: 'example.page.link'
    };
    user.sendEmailVerification(actionCodeSettings)
      .then(() => {
        if (user.email) {
          // window.localStorage.setItem('emailForSignIn', user.email);
          console.log('email sent to ' + user.email);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  signInWithEmailPassword(email: string, password: string): Promise<firebase.User | void> {
    return this.auth.signInWithEmailAndPassword(email, password).then((userCredential) => {
      return userCredential.user!;
    }).catch(error => {
      console.error(error);
      // auth/wrong-password
    })
  }
}

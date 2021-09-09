import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import {User} from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    public auth: AngularFireAuth,
  ) {
    this.auth.onAuthStateChanged(user => {
      console.log(user);
      console.log('onAuthStateChanged triggered!');
    });
  }

  signUpViaEmailPassword(email: string, password: string): Promise<firebase.auth.UserCredential | void> {
    return this.auth.createUserWithEmailAndPassword(email, password).then(async (userCredential) => {
      await this.sendSignUpVerificationMail(email, userCredential.user!.uid);
      return userCredential;
    }).catch(error => {
        // auth/email-already-in-use
        console.error(error);
    });
  }

  sendSignUpVerificationMail(email: string, uid: string) {
    const actionCodeSettings = {
      url: `http://localhost:4200/sign-up-email-verified?uid=${uid}`,
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

    this.auth.sendSignInLinkToEmail(email, actionCodeSettings)
      .then(() => {
        window.localStorage.setItem('emailForSignIn', email);
        console.log('email sent to ' + email);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  signUpVerified(userUnverified: User) {
    if (this.auth.isSignInWithEmailLink(window.location.href)){
      console.log('is sign in with email link');
      const email = window.localStorage.getItem('emailForSignIn');
      console.log(email);
      if (email && userUnverified.email === email) {
        this.auth.signInWithEmailLink(email, window.location.href)
          .then((result) => {
            console.log(result);
            window.localStorage.removeItem('emailForSignIn');
          })
          .catch((error) => {
            console.error(error);
          });
      }

    }
  }
}

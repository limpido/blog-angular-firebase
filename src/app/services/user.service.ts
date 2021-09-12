import { Injectable } from '@angular/core';
import {AngularFirestore, DocumentChangeAction} from "@angular/fire/compat/firestore";
import {User} from "../models/user";
import {map, first} from "rxjs/operators";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private af: AngularFirestore,
  ) { }

  setUser(uid: string, user: User): Promise<void> {
    return this.af.doc(`users/${uid}`).set(user);
  }

  getUserByUid(uid: string): Observable<User> {
    return this.af.doc(`users/${uid}`).snapshotChanges().pipe(
      map(userDoc => {
        if (userDoc.payload.data()) {
          return {...(userDoc.payload.data()) as Object} as User;
        }
        return null;
    }));
  }

  updateUser(uid: string, data: User | any): Promise<void> {
    return this.af.doc(`users/${uid}`).update(data);
  }

  setUserUnverified(uid: string, user: User): Promise<void> {
    return this.af.doc(`users_unverified/${uid}`).set(user);
  }

  getUserUnverifiedByEmail(email: string): Promise<Array<User>> {
    return this.af.collection(`users_unverified`, ref => {
      return ref
        .where('email', '==', email)
        .limit(1);
    }).snapshotChanges().pipe(map((docs: DocumentChangeAction<any>[]) =>
      docs.map((a: DocumentChangeAction<any>) => {
        const data = a.payload.doc.data();
        const docId = a.payload.doc.id;
        return {...data, docId};
      }))).pipe(first()).toPromise();
  }

  deleteUserUnverified(uid: string): Promise<void> {
    return this.af.doc(`users_unverified/${uid}`).delete();
  }
}

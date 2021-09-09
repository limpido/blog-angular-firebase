import { Injectable } from '@angular/core';
import {AngularFirestore, DocumentChangeAction} from "@angular/fire/compat/firestore";
import {User} from "../models/user";
import {map, first} from "rxjs/operators";

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

  setUserUnverified(uid: string, user: User): Promise<void> {
    return this.af.doc(`users_unverified/${uid}`).set(user);
  }

  getUserUnverifiedByUid(uid: string): Promise<Array<User>> {
    return this.af.collection(`users_unverified`, ref => {
      return ref
        .where('uid', '==', uid)
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

import { Injectable } from '@angular/core';
import {AngularFirestore, DocumentChangeAction} from "@angular/fire/compat/firestore";
import {Category} from "../models/category";
import {Blog} from "../models/blog";
import {first, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(
    private af: AngularFirestore,
  ) { }

  setCategory(uid: string, category: Category): Promise<void> {
    return this.af.collection(`users/${uid}/categories`).doc(`${category.name}`).set(category);
  }

  getCategories(uid: string): Promise<Array<Category>> {
    return this.af.collection(`users/${uid}/categories`).snapshotChanges()
      .pipe(map((docs: DocumentChangeAction<any>[]) =>
        docs.map((a: DocumentChangeAction<any>) => {
          const data = a.payload.doc.data();
          const docId = a.payload.doc.id;
          return {...data, docId};
        }))).pipe(first()).toPromise();
  }

  deleteCategory() {

  }

  setBlog(blog: Blog) {

  }

  getAllBlogs(uid: string): Promise<Array<Blog>> {
    return this.af.collection(`users/${uid}/blogs`).snapshotChanges()
      .pipe(map((docs: DocumentChangeAction<any>[]) =>
        docs.map((a: DocumentChangeAction<any>) => {
          const data = a.payload.doc.data();
          const docId = a.payload.doc.id;
          return {...data, docId};
        }))).pipe(first()).toPromise();
  }

  getBlogsByCategory(uid: string, categoryName: string): Promise<Array<Blog>> {
    return this.af.collection(`users/${uid}/blogs`, ref => {
      return ref
        .where('category_name', '==', categoryName);
    }).snapshotChanges().pipe(map((docs: DocumentChangeAction<any>[]) =>
      docs.map((a: DocumentChangeAction<any>) => {
        const data = a.payload.doc.data();
        const docId = a.payload.doc.id;
        return {...data, docId};
      }))).pipe(first()).toPromise();
  }

  updateBlog() {

  }

  deleteBlog() {

  }
}

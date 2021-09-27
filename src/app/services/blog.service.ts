import { Injectable } from '@angular/core';
import {AngularFirestore, DocumentChangeAction} from "@angular/fire/compat/firestore";
import {Category} from "../models/category";
import {Blog} from "../models/blog";
import {first, map} from "rxjs/operators";
import firebase from "firebase/compat/app";
import DocumentReference = firebase.firestore.DocumentReference;
import FieldValue = firebase.firestore.FieldValue;

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

  updateCategory(uid: string, categoryName: string, data: Category | any): Promise<void> {
    return this.af.doc(`users/${uid}/categories/${categoryName}`).update(data);
  }

  async incrementCategoryBlogNumber(uid: string, categoryName: string): Promise<void> {
    await this.updateCategory(uid, categoryName, {blog_number: FieldValue.increment(1)});
  }

  getCategoryByCategoryName(uid: string, categoryName: string) {
    return this.af.doc(`users/${uid}/categories/${categoryName}`).ref.get().then((docSnapshot) => {
      return docSnapshot.data();
    });
  }

  getAllCategories(uid: string): Promise<Array<Category>> {
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

  addBlog(uid: string, blog: Blog): Promise<DocumentReference<Blog>> {
    return this.af.collection(`users/${uid}/blogs`).add(blog);
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
    const category: Category = {
      name: categoryName
    };
    return this.af.collection(`users/${uid}/blogs`, ref => {
      return ref
        .where('category', '==', category);
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

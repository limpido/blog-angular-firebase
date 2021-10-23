import {Injectable, Query} from '@angular/core';
import {AngularFirestore, DocumentChangeAction, DocumentData} from "@angular/fire/compat/firestore";
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

  getBlogById(uid: string, blogId: string) {
    return this.af.doc(`users/${uid}/blogs/${blogId}`).ref.get().then((docSnapshot) => {
      return docSnapshot.data();
    });
  }

  getBlogs(uid: string, options?: {limit?: number, startAfter?: Blog, categoryName?: string}): Promise<Array<Blog>> {
    return this.af.collection(`users/${uid}/blogs`, ref => {
      let query: firebase.firestore.Query<DocumentData> = ref;
      query = query.orderBy('last_edited_timestamp', 'desc');
      if (options?.categoryName) {
        const category: Category = {
          name: options.categoryName
        };
        query = query.where('category', '==', category);
      }
      if (options?.startAfter) query = query.startAfter(options.startAfter.last_edited_timestamp);
      if (options?.limit) query = query.limit(options.limit);
      return query;
    }).snapshotChanges().pipe(map((docs: DocumentChangeAction<any>[]) =>
      docs.map((a: DocumentChangeAction<any>) => {
        const data = a.payload.doc.data();
        const docId = a.payload.doc.id;
        return {...data, docId};
      }))).pipe(first()).toPromise();
  }

  updateBlog(uid: string, blogId: string, data: Blog | any): Promise<void> {
    return this.af.doc(`users/${uid}/blogs/${blogId}`).update(data);
  }

  deleteBlog() {

  }
}

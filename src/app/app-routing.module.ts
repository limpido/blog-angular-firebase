import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BaseComponent} from "./base/base.component";
import {SignUpVerificationComponent} from "./sign-up-verification/sign-up-verification.component";
import {EditProfileComponent} from "./edit-profile/edit-profile.component";
import {WriteBlogComponent} from "./write-blog/write-blog/write-blog.component";
import {CategoriesComponent} from "./categories/categories.component";
import {ViewBlogComponent} from "./view-blog/view-blog.component";
import {HomeComponent} from "./home/home.component";

const routes: Routes = [
  {
    path: 'sign-up-verification-email-sent',
    pathMatch: 'full',
    component: SignUpVerificationComponent
    // guard
  },
  {
    path: 'sign-up-email-verification',
    pathMatch: 'full',
    component: BaseComponent
    // guard
  },
  {
    path: ':uid/edit-profile',
    pathMatch: 'full',
    component: EditProfileComponent
    // guard
  },
  {
    path: ':uid/write',
    pathMatch: 'full',
    component: WriteBlogComponent
    // guard
  },
  {
    path: ':uid/categories',
    pathMatch: 'full',
    component: CategoriesComponent
    // guard
  },
  {
    path: ':uid/blog/:blogId',
    pathMatch: 'full',
    component: ViewBlogComponent
    // guard
  },
  {
    path: ':uid',
    pathMatch: 'full',
    component: HomeComponent
    // guard
  },
  {
    path: '**',
    pathMatch: 'full',
    component: BaseComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

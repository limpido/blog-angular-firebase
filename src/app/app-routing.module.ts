import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BaseComponent} from "./base/base.component";
import {SignUpVerificationComponent} from "./sign-up-verification/sign-up-verification.component";
import {EditProfileComponent} from "./edit-profile/edit-profile.component";
import {WriteBlogComponent} from "./write-blog/write-blog/write-blog.component";
import {CategoriesComponent} from "./categories/categories.component";
import {ViewBlogComponent} from "./view-blog/view-blog.component";
import {HomeComponent} from "./home/home.component";
import {ProfileGuard} from "./guards/profile.guard";
import {AuthGuard} from "./guards/auth.guard";
import {BlogGuard} from "./guards/blog.guard";
import {BlogBaseComponent} from "./blog-base/blog-base.component";

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
    component: EditProfileComponent,
    canActivate: [ProfileGuard]
  },
  {
    path: ':uid/write',
    pathMatch: 'full',
    component: WriteBlogComponent,
    canActivate: [AuthGuard]
  },
  {
    path: ':uid/categories',
    pathMatch: 'full',
    component: BlogBaseComponent,
    canActivate: [BlogGuard]
  },
  {
    path: ':uid/blog/:blogId',
    pathMatch: 'full',
    component: ViewBlogComponent,
    canActivate: [BlogGuard]
  },
  {
    path: ':uid',
    pathMatch: 'full',
    component: BlogBaseComponent,
    canActivate: [BlogGuard]
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

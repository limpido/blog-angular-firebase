import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BaseComponent} from "./base/base.component";
import {SignUpVerificationComponent} from "./sign-up-verification/sign-up-verification.component";
import {EditProfileComponent} from "./edit-profile/edit-profile.component";
import {WriteBlogComponent} from "./write-blog/write-blog/write-blog.component";
import {CategoriesComponent} from "./categories/categories.component";

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
    path: ':username/edit-profile',
    pathMatch: 'full',
    component: EditProfileComponent
    // guard
  },
  {
    path: ':username/write',
    pathMatch: 'full',
    component: WriteBlogComponent
    // guard
  },
  {
    path: ':username/categories',
    pathMatch: 'full',
    component: CategoriesComponent
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

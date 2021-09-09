import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BaseComponent} from "./base/base.component";
import {SignUpVerificationComponent} from "./sign-up-verification/sign-up-verification.component";
import {EditProfileComponent} from "./edit-profile/edit-profile.component";

const routes: Routes = [
  {
    path: 'sign-up-verification-email-sent',
    pathMatch: 'full',
    component: SignUpVerificationComponent
    // guard
  },
  {
    path: 'sign-up-email-verified',
    pathMatch: 'full',
    component: EditProfileComponent
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

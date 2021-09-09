import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BaseComponent} from "./base/base.component";

const routes: Routes = [
  {
    path: '**',
    pathMatch: 'full',
    component: BaseComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

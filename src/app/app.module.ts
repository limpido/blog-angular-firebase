import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BaseComponent } from './base/base.component';
import {MatButtonModule} from "@angular/material/button";
import { SignUpModalComponent } from './modals/sign-up-modal/sign-up-modal.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatDialogModule} from "@angular/material/dialog";
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import {MatIconModule} from '@angular/material/icon';
import {SignUpVerificationComponent} from "./sign-up-verification/sign-up-verification.component";
import { LogInModalComponent } from './modals/log-in-modal/log-in-modal.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatMenuModule} from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { WriteBlogComponent } from './write-blog/write-blog/write-blog.component';
import { MarkdownModule } from 'ngx-markdown';
import { BlogEditorComponent } from './write-blog/blog-editor/blog-editor.component';
import {MatSelectModule} from '@angular/material/select';
import { CategoriesComponent } from './categories/categories.component';
import {MatDividerModule} from '@angular/material/divider';
import { BlogDisplayCardComponent } from './blog-display-card/blog-display-card.component';
import {MatListModule} from '@angular/material/list';
import { ViewBlogComponent } from './view-blog/view-blog.component';
import { HomeComponent } from './home/home.component';
import { BlogBaseComponent } from './blog-base/blog-base.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import {environmentProd} from "../environments/environment.prod";

@NgModule({
  declarations: [
    AppComponent,
    BaseComponent,
    SignUpModalComponent,
    SignUpVerificationComponent,
    EditProfileComponent,
    LogInModalComponent,
    NavBarComponent,
    WriteBlogComponent,
    BlogEditorComponent,
    CategoriesComponent,
    BlogDisplayCardComponent,
    ViewBlogComponent,
    HomeComponent,
    BlogBaseComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environmentProd.firebase),
    AngularFirestoreModule,
    AppRoutingModule,
    FlexLayoutModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSnackBarModule,
    MatTabsModule,
    MatMenuModule,
    FormsModule,
    AngularFireStorageModule,
    MarkdownModule.forRoot(),
    MatSelectModule,
    MatDividerModule,
    MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {environment} from "../environments/environment";
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

@NgModule({
  declarations: [
    AppComponent,
    BaseComponent,
    SignUpModalComponent,
    SignUpVerificationComponent,
    EditProfileComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AppRoutingModule,
    FlexLayoutModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

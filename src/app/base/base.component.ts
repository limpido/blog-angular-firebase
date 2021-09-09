import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {SignUpModalComponent} from "../modals/sign-up-modal/sign-up-modal.component";
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
  }

  signUp(): void {
    const signupModal = this.dialog.open(SignUpModalComponent, {
      width: '400px',
    });

    signupModal.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  logIn() {

  }

}

import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-log-in-modal',
  templateUrl: './log-in-modal.component.html',
  styleUrls: ['./log-in-modal.component.scss']
})
export class LogInModalComponent implements OnInit {

  logInForm: FormGroup;
  hidePassword: boolean = true;
  hasLogInError: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    public logInModal: MatDialogRef<LogInModalComponent>,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.logInForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onSubmit(): Promise<void> {
    if (this.logInForm.valid) {
      this.logInModal.disableClose = true;
      this.hasLogInError = false;
      const email = this.logInForm.get('email')?.value.trim();
      const password = this.logInForm.get('password')?.value.trim();
      const user = await this.authService.signInWithEmailPassword(email, password);
      if (!user) {
        this.hasLogInError = true;
        this.logInModal.disableClose = false;
      } else {
        this.logInModal.close(user);
      }
    }
  }

}

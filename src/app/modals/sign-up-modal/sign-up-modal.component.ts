import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {User} from "../../models/user";
import {Router} from "@angular/router";
import {MatDialogRef} from "@angular/material/dialog";
import {UserService} from "../../services/user.service";


@Component({
  selector: 'app-sign-up-modal',
  templateUrl: './sign-up-modal.component.html',
  styleUrls: ['./sign-up-modal.component.scss']
})
export class SignUpModalComponent implements OnInit {

  signUpForm: FormGroup;
  hidePassword: boolean = true;
  hidePasswordConfirm: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    public signUpModal: MatDialogRef<SignUpModalComponent>,
    private userService: UserService,
  ) {
    this.signUpForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', Validators.required]
    }, {validators: this.passwordMatchValidator});
  }

  ngOnInit(): void {

  }

  passwordMatchValidator(fg: FormGroup) {
    const password = fg.get('password')!.value;
    const passwordConfirm = fg.get('passwordConfirm')!.value;
    return password && (password === passwordConfirm) ? null : {mismatch: true};
  }

  async onSubmit() {
    if (this.signUpForm.valid) {
      this.signUpModal.disableClose = true;
      const email = this.signUpForm.get('email')?.value.trim();
      const password = this.signUpForm.get('password')?.value.trim();
      const username = this.signUpForm.get('username')?.value.trim();
      const userCredential = await this.authService.signUpViaEmailPassword(email, password);
      if (userCredential) {
        console.log(userCredential);
        const uid = userCredential.user!.uid;
        const user: User = {
          uid,
          username,
          email,
          email_verified: false,
          profile_pic_url: '',
        }
        await Promise.all([
          this.userService.setUser(uid, user),
          this.userService.setUserUnverified(uid, user)
        ]);
        this.signUpModal.close();
        await this.router.navigate([`/sign-up-verification-email-sent`]);
      }
    }
  }

}

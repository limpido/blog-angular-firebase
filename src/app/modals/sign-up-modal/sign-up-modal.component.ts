import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {User} from "../../models/user";
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
    private userService: UserService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    public signUpModal: MatDialogRef<SignUpModalComponent>,
  ) {}

  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email], [this.emailExistsValidator.bind(this)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', Validators.required]
    }, {validators: [this.passwordMatchValidator]});
  }

  passwordMatchValidator(fg: FormGroup): void {
    const password = fg.get('password')!.value;
    const passwordConfirm = fg.get('passwordConfirm')!.value;
    if (password && password !== passwordConfirm) {
      fg.get('passwordConfirm').setErrors({mismatch: true});
    }
  }

  async emailExistsValidator(fc: FormControl): Promise<ValidationErrors | null> {
    const email = fc.value!.trim();
    return new Promise(async (resolve, reject) => {
      this.userService.userEmailExists(email).then((users) => {
        if (users.length > 0) {
          resolve({emailExists: true});
        } else {
          resolve(null);
        }
      });
    });
  }

  async onSubmit(): Promise<void> {
    if (this.signUpForm.valid) {
      this.signUpModal.disableClose = true;
      const email = this.signUpForm.get('email')?.value.trim();
      const password = this.signUpForm.get('password')?.value.trim();
      const username = this.signUpForm.get('username')?.value.trim();
      const userCredential = await this.authService.signUpViaEmailPassword(email, password);
      this.signUpModal.close({submitted: true});

      if (userCredential) {
        const uid = userCredential.user.uid;
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
      }
    }
  }

}

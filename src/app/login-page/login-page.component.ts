import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent implements OnInit {
  isLoginMode = true;
  loginForm: FormGroup;
  email: string;
  password: string;

  error: string;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.email, Validators.required]),
      password: new FormControl(null, [Validators.required]),
    });
  }

  onSubmit() {
    this.email = this.loginForm.value.email;
    this.password = this.loginForm.value.password;

    if (this.isLoginMode) {
      this.authService.signInUser(this.email, this.password).catch((e) => {
        this.error = this.authService.handleError(e.code);
      });
    } else {
      this.authService.signUpUser(this.email, this.password).catch((e) => {
        this.error = this.authService.handleError(e.code);
      });
    }
  }

  resetError() {
    this.error = null;
  }

  switchAuthMode() {
    this.isLoginMode = !this.isLoginMode;
  }
}

import { CommonModule } from '@angular/common';

import { Component } from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  Router,
  RouterLink
} from '@angular/router';

import { Auth } from '../../services/auth';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ CommonModule,
    ReactiveFormsModule,
    RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  loginForm: any;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router
  ) {

    this.loginForm = this.fb.group({

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        '',
        Validators.required
      ],

      remember: [false]
    });

  }

  login() {

    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      return;
    }

    const value = this.loginForm.value;

    this.auth.getUsers().subscribe((users: any[]) => {

      const user = users.find(

        u =>

          u.email === value.email &&

          u.password === value.password

      );

      if (user) {

        localStorage.setItem(
          'user',
          JSON.stringify(user)
        );

        this.router.navigate(['/profile']);

      } else {

        alert(
          'Wrong Email or Password'
        );

      }

    });

  }
}


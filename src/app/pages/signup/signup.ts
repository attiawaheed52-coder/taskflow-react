import { Component } from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';

import { CommonModule } from '@angular/common';

import { Auth } from '../../services/auth';

@Component({
  selector: 'app-signup',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],

  templateUrl: './signup.html',

  styleUrl: './signup.css'
})
export class SignupComponent {

  hide = true;

  signupForm: any;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router
  ) {

    this.signupForm = this.fb.group({

      name: ['', Validators.required],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ],

      confirmPassword: [
        '',
        Validators.required
      ]
    });

  }

  submit() {

  if (this.signupForm.invalid) {

    this.signupForm.markAllAsTouched();

    return;
  }

  const value = this.signupForm.value;

  if (
    value.password !==
    value.confirmPassword
  ) {

    alert('Passwords do not match');

    return;
  }

  this.auth.register({

    name: value.name,

    email: value.email,

    password: value.password

  }).subscribe({

    next: () => {

      alert('Signup Successful');

      this.router.navigate(['/login']);

    },

    error: (err) => {

      console.log(err);

      alert('Signup Failed');

    }

  });

}
}
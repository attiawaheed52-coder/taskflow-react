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
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPasswordComponent {
  resetForm: any;
  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router
  ) {

    this.resetForm = this.fb.group({

      name: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      newPassword: [
        '',
        Validators.required
      ]
    });

  }

  resetPassword() {

    const value = this.resetForm.value;

    this.auth.getUsers().subscribe((users: any[]) => {

      const user = users.find(

        u =>

          u.name === value.name &&

          u.email === value.email

      );

      if (user) {

        this.auth.updateUser(
          user.id,
          {
            password: value.newPassword
          }
        ).subscribe(() => {

          alert(
            'Password Updated'
          );

          this.router.navigate(['/login']);

        });

      } else {

        alert('User not found');

      }

    });

  }
}


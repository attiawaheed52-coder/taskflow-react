import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',

  standalone: true,

  imports: [CommonModule],

  templateUrl: './profile.html',

  styleUrl: './profile.css'
})
export class ProfileComponent {

  user: any = {};

  constructor(
    private router: Router
  ) {

    if (typeof window !== 'undefined') {

      const data =
        localStorage.getItem('user');

      this.user =
        data ? JSON.parse(data) : {};

    }

  }

  logout() {

    localStorage.removeItem('user');

    this.router.navigate(['/login']);

  }

}
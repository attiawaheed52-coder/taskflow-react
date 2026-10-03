import { Routes } from '@angular/router';

<<<<<<< HEAD
export const routes: Routes = [];
=======
export const routes: Routes = [

  {
    path: '',
    redirectTo: 'signup',
    pathMatch: 'full'
  },

  {
  path: 'signup',
  loadComponent: () =>
    import('./pages/signup/signup')
    .then(m => m.SignupComponent)
},

  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login')
      .then(m => m.LoginComponent)
  },

  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./pages/forgot-password/forgot-password')
      .then(m => m.ForgotPasswordComponent)
  },

  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile')
      .then(m => m.ProfileComponent)
  }
];

>>>>>>> 84ae4432729ae9468673bd85d8e5f7a33c3773b5

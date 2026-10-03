<<<<<<< HEAD
import { ApplicationConfig }
from '@angular/core';

import {
  provideHttpClient,
  withFetch
} from '@angular/common/http';

export const appConfig: ApplicationConfig = {

  providers: [

    provideHttpClient(withFetch())

  ]

};
=======
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay())
  ]
};
>>>>>>> 84ae4432729ae9468673bd85d8e5f7a33c3773b5

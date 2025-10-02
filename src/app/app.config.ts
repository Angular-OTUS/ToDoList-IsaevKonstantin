import { provideEventPlugins } from "@taiga-ui/event-plugins";
import { provideAnimations } from "@angular/platform-browser/animations";
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideEventPlugins(),
    provideStore(),
    provideEffects(),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
],
};

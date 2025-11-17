import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpBooleanInterceptor } from './app/interceptors/boolean-response';
import { provideRouter, withViewTransitions } from '@angular/router';
import { routes } from './app/app.routes';

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideHttpClient(
      withInterceptors([httpBooleanInterceptor]),
    ),
    provideRouter(routes, withViewTransitions()),
  ]
}).catch((err) => console.error(err));

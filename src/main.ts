import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { toDoListReducer } from './app/store/to-do-list-store/reduser';
import { ToDoEffects } from './app/store/to-do-list-store/effect';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpBooleanInterceptor } from './app/interceptors/boolean-response';

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideHttpClient(
      withInterceptors([httpBooleanInterceptor]),
    ),
    provideStore({toDoList: toDoListReducer}),
    provideEffects([ToDoEffects]),
  ]
}).catch((err) => console.error(err));

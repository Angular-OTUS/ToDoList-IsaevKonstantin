import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { toDoListReducer } from './app/store/to-do-list-store/reduser';
import { ToDoEffects } from './app/store/to-do-list-store/effect';

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideStore({toDoList: toDoListReducer}),
    provideEffects(),
    provideEffects([ToDoEffects]),
  ]
}).catch((err) => console.error(err));

import { Component, signal } from '@angular/core';
import { ToDoList } from './components/to-do-list/to-do-list';
import { TuiRoot } from '@taiga-ui/core';
import { Toasts } from "./components/toasts/toasts";

@Component({
  selector: 'app-root',
  imports: [ToDoList, TuiRoot, Toasts],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('to-do-list');
}

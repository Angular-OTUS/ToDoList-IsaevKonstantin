import { Component, signal } from '@angular/core';
import { ToDoListComponent } from './components/to-do-list/to-do-list';

@Component({
  selector: 'app-root',
  imports: [ToDoListComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('to-do-list');
}

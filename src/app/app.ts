import { Component, signal } from '@angular/core';
import { TuiRoot } from '@taiga-ui/core';
import { Toasts } from "./components/toasts/toasts";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [TuiRoot, Toasts, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('to-do-list');
}

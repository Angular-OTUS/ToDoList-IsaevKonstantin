import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'toasts',
  templateUrl: './toasts.html',
  imports: [TranslateModule],
  styleUrl: './toasts.scss',
})
export class Toasts {
  protected messages = inject(ToastService).messages;
}
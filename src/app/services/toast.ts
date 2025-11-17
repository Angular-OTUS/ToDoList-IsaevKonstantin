import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _messages = signal<string[]>([]);
  readonly messages = this._messages.asReadonly();

  showToast(message: string) {
    this._messages.update((msgs) => [...msgs, message]);

    setTimeout(() => {
      this._messages.update((msgs) => msgs.filter(m => m !== message));
    }, 3000);
  }
}
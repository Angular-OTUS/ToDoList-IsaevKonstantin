import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _messages$ = new BehaviorSubject<string[]>([]);
  messages$ = this._messages$.asObservable();

  showToast(message: string) {
    const current = this._messages$.getValue();
    this._messages$.next([...current, message]);

    setTimeout(() => {
      const updated = this._messages$.getValue().filter(m => m !== message);
      this._messages$.next(updated);
    }, 3000);
  }
}
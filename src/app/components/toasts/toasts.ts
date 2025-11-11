import { Component, inject, OnInit } from '@angular/core';
import { ToastService } from '../../services/toast';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'toasts',
  imports: [AsyncPipe],
  templateUrl: './toasts.html',
  styleUrl: './toasts.scss',
})
export class Toasts implements OnInit {
  private readonly toastService = inject(ToastService);

  protected messages$!: Observable<string[]>;

  ngOnInit(): void {
      this.messages$ = this.toastService.messages$;
  }
}
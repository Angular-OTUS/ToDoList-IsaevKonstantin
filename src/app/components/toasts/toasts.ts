import { Component, OnInit } from '@angular/core';
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
    protected messages$!: Observable<string[]>;

    constructor(private toastService: ToastService) {}

    ngOnInit(): void {
        this.messages$ = this.toastService.messages$;
    }
}
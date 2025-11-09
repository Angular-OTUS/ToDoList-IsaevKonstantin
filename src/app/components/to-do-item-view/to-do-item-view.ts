import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { TuiScrollbar, TuiTextfield } from '@taiga-ui/core';
import { TuiTextarea } from '@taiga-ui/kit';
import { debounceTime, map, Observable, tap } from 'rxjs';
import { filteredToDoList, isEdit } from '../../store/to-do-list-store/select';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IToDoItem } from '../../interfaces/interfaces';
import { ToastService } from '../../services/toast';
import { updateDescription } from '../../store/to-do-list-store/action';

@Component({
  selector: 'to-do-item-view',
  imports: [ReactiveFormsModule, CommonModule, TuiTextfield, TuiTextarea, TuiScrollbar],
  templateUrl: './to-do-item-view.html',
  styleUrl: './to-do-item-view.scss'
})
export class ToDoItemView implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  protected textareaControl = new FormControl<string>("", {nonNullable: true});
  protected isEdit$!: Observable<boolean>;
  protected selectedItem$!: Observable<IToDoItem | null>;

  constructor() {
    this.route.paramMap.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((pm) => {
      this.getSelectedItem(pm.get('id'));
    })
  }

  ngOnInit(): void {
    this.isEdit$ = this.store.pipe(select(isEdit));
    this.descriptionChangeSub();
  }

  private getSelectedItem(id: string | null): void {
    if (!id) {
      this.toast.showToast("Не удалось получить данные дела!");
      return;
    }
    this.selectedItem$ = this.store.pipe(
      select(filteredToDoList),
      takeUntilDestroyed(this.destroyRef),
      map((list) => list.find((listItem) => listItem.id === +id) ?? null),
    );
    this.selectedItem$.pipe(
      takeUntilDestroyed(this.destroyRef),
      tap((item) => {
        if (!item) {
          this.router.navigate(['../'], {relativeTo: this.route});
        } else {
          this.textareaControl.setValue(item.description);
        }
      }),
    ).subscribe();
  }

  private descriptionChangeSub(): void {
    this.textareaControl.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
      debounceTime(300),
    ).subscribe(
      (value) => this.store.dispatch(updateDescription({description: value}))
    );
  }
}

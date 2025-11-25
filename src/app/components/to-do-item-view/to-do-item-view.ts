import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TuiScrollbar, TuiTextfield } from '@taiga-ui/core';
import { TuiTextarea } from '@taiga-ui/kit';
import { debounceTime } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { IToDoItem } from '../../interfaces/interfaces';
import { toDoStore } from '../../store/to-do-signal-store';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'to-do-item-view',
  imports: [ReactiveFormsModule, CommonModule, TuiTextfield, TuiTextarea, TuiScrollbar, TranslateModule],
  templateUrl: './to-do-item-view.html',
  styleUrl: './to-do-item-view.scss'
})
export class ToDoItemView {
  private readonly store = inject(toDoStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly paramMap  = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap
  });
  private id = computed(() => this.paramMap().get('id'))
  private list = this.store.filteredToDoList;

  protected textareaControl = new FormControl<string>("", {nonNullable: true});
  protected textarea = toSignal(this.textareaControl.valueChanges.pipe(debounceTime(300)), {
    initialValue: this.textareaControl.value
  });
  protected isEdit = this.store.isEdit;
  protected selectedItem = computed<IToDoItem | null>(() =>  {
    const id = this.id();
    if (!id) return null;
    const target = this.list().find((listItem) => listItem.id === +id);
    return target ?? null;
  });
  
  constructor() {
    effect(() => {
      const item = this.selectedItem();
      if (!item) {
        this.router.navigate(['../'], {relativeTo: this.route});
        return;
      } else {
        this.textareaControl.setValue(item.description);
      }
    });
    effect(() => {
      this.store.updateDescription(this.textarea());
    });
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ToDoListItem } from '../to-do-list-item/to-do-list-item';
import { CommonModule } from '@angular/common';
import { IChStatusToDoItem, INewToDoItem, IToDoItem } from '../../interfaces/interfaces';
import { map, Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { isLoading, allToDoList } from '../../store/to-do-list-store/select';
import { addItem, changeItemStatus, getList } from '../../store/to-do-list-store/action';
import { ToastService } from '../../services/toast';
import { EStatus } from '../../enums/status';
import { UiButton, UiSpinner } from '../../library';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusContent } from '@taiga-ui/polymorpheus';
import { ToDoCreateItem } from '../to-do-create-item/to-do-create-item';
import { Tooltip } from '../../directives';

@Component({
  selector: 'board',
  imports: [ToDoListItem, ToDoCreateItem, Tooltip, UiSpinner, CommonModule, ReactiveFormsModule, UiButton],
  templateUrl: './board.html',
  styleUrl: './board.scss',
})
export class Board implements OnInit {
  private readonly dialogs = inject(TuiDialogService);
  private readonly store = inject(Store);
  private readonly toast = inject(ToastService);

  protected allList$!: Observable<IToDoItem[]>;
  protected inProgressList$!: Observable<IToDoItem[]>;
  protected completedList$!: Observable<IToDoItem[]>;
  protected isLoading$!: Observable<boolean>;
  protected readonly eStatus = EStatus;
  protected readonly statusOptions = [
    this.eStatus.All,
    this.eStatus.InProgress,
    this.eStatus.Completed,
  ];
  
  ngOnInit(): void {
    this.isLoading$ = this.store.pipe(select(isLoading));
    this.allList$ = this.store.pipe(select(allToDoList));
    this.inProgressList$ = this.allList$.pipe(
      map((list) => list.filter((item) => item.status === this.eStatus.InProgress)),
    );
    this.completedList$ = this.allList$.pipe(
      map((list) => list.filter((item) => item.status === this.eStatus.Completed)),
    );
    this.requestList();
  }

  private requestList(): void {
    this.toast.showToast("Загрузка дел...");
    this.store.dispatch(getList());
  }

  protected changeStatusItem(data: IChStatusToDoItem): void {
    this.store.dispatch(changeItemStatus({item: {id: data.id, status: data.status}}));
  }

  protected createItem(content: PolymorpheusContent<TuiDialogContext<INewToDoItem>>): void {
    this.dialogs.open(content).subscribe({
      next: (item) => {
        this.toast.showToast("Добавление нового дела...");
        this.store.dispatch(addItem({item: item}));
      },
    });
  }
}

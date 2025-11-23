import { Component, computed, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ToDoListItem } from '../to-do-list-item/to-do-list-item';
import { CommonModule } from '@angular/common';
import { IChStatusToDoItem, INewToDoItem } from '../../interfaces/interfaces';
import { ToastService } from '../../services/toast';
import { EStatus } from '../../enums/status';
import { UiButton, UiSpinner } from '../../library';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusContent } from '@taiga-ui/polymorpheus';
import { ToDoCreateItem } from '../to-do-create-item/to-do-create-item';
import { Tooltip } from '../../directives';
import { toDoStore } from '../../store/to-do-signal-store';

@Component({
  selector: 'board',
  imports: [ToDoListItem, ToDoCreateItem, Tooltip, UiSpinner, CommonModule, ReactiveFormsModule, UiButton],
  templateUrl: './board.html',
  styleUrl: './board.scss',
})
export class Board implements OnInit {
  private readonly dialogs = inject(TuiDialogService);
  private readonly toast = inject(ToastService);
  private readonly store = inject(toDoStore);

  protected readonly eStatus = EStatus;
  protected readonly statusOptions = [
    this.eStatus.All,
    this.eStatus.InProgress,
    this.eStatus.Completed,
  ];
  protected allList = this.store.list;
  protected inProgressList = computed(() => {
    const list = this.allList();
    return list.filter((item) => item.status === this.eStatus.InProgress);
  });
  protected completedList = computed(() => {
    const list = this.allList();
    return list.filter((item) => item.status === this.eStatus.Completed);
  });
  protected isLoading = this.store.isLoading;

  ngOnInit(): void {
    this.requestList();
  }

  private requestList(): void {
    this.toast.showToast("Загрузка дел...");
    this.store.loadList();
  }

  protected changeStatusItem(data: IChStatusToDoItem): void {
    this.store.changeItemStatus({id: data.id, status: data.status});
  }

  protected createItem(content: PolymorpheusContent<TuiDialogContext<INewToDoItem>>): void {
    this.dialogs.open(content).subscribe({
      next: (item) => {
        this.toast.showToast("Добавление нового дела...");
        this.store.addItem(item);
      },
    });
  }
}

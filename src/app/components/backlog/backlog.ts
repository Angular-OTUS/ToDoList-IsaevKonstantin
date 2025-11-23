import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ToDoListItem } from '../to-do-list-item/to-do-list-item';
import { TuiRadioList } from '@taiga-ui/kit';
import { CommonModule } from '@angular/common';
import { Tooltip } from '../../directives';
import { IChStatusToDoItem, INewToDoItem, ISaveToDoItem } from '../../interfaces/interfaces';
import { ToastService } from '../../services/toast';
import { toSignal } from '@angular/core/rxjs-interop';
import { EStatus } from '../../enums/status';
import { ToDoCreateItem } from "../to-do-create-item/to-do-create-item";
import { UiSpinner, UiButton } from '../../library';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { type PolymorpheusContent} from '@taiga-ui/polymorpheus';
import { toDoStore } from '../../store/to-do-signal-store';

@Component({
  selector: 'backlog',
  imports: [ToDoListItem, ToDoCreateItem, UiSpinner, Tooltip, CommonModule, ReactiveFormsModule, TuiRadioList, RouterOutlet, UiButton],
  templateUrl: './backlog.html',
  styleUrl: './backlog.scss',
})
export class Backlog implements OnInit {
  private readonly dialogs = inject(TuiDialogService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(toDoStore);
  
  protected list = this.store.list;
  protected isLoading = this.store.isLoading;
  protected isEdit = this.store.isEdit;
  protected statusFilterControl = new FormControl<EStatus>(EStatus.InProgress, { nonNullable: true });
  protected filter = toSignal(this.statusFilterControl.valueChanges, {
    initialValue: this.statusFilterControl.value
  });
  protected filteredList = computed(() => {
    const list = this.list();
    const filter = this.filter();
    return filter === EStatus.All ? list : list.filter((listItem) => listItem.status === filter);
  });
  protected readonly eStatus = EStatus;
  protected readonly statusOptions = [
    this.eStatus.All,
    this.eStatus.InProgress,
    this.eStatus.Completed,
  ];

  get SelectedId(): number | null {
    const currentId = this.route.firstChild?.snapshot.paramMap.get("id");
    return !!currentId ? Number(currentId) : null;
  }

  get NoneToDoText(): string {
    switch (this.statusFilterControl.value) {
      case this.eStatus.InProgress:
        return "Список не выполненых дел пуст!";
      case this.eStatus.Completed:
        return "Список выполненых дел пуст!";
      default:
        return "Список дел пуст, добавьте новые дела!";
    }
  }

  constructor() {
    effect(() => {
      this.store.switchStatusFilter(this.filter());
    });
  }

  ngOnInit(): void {
    this.requestList();
  }

  private requestList(): void {
    this.toast.showToast("Загрузка дел...");
    this.store.loadList();
  }

  protected deleteItem(id: number): void {
    this.toast.showToast("Удаление дела...");
    this.store.deleteItem(id);
  }

  protected selectItem(id: number): void {
    this.store.isEditItem(false);
    if (id === this.SelectedId) {
      this.router.navigate(['../'], {relativeTo: this.route});
    } else {
      this.router.navigate([id], {relativeTo: this.route});
    }
  }

  protected editItem(id: number): void {
    this.store.isEditItem(true);
    this.router.navigate([id], {relativeTo: this.route});
  }

  protected saveItem(data: ISaveToDoItem): void {
    this.toast.showToast("Сохранение дела...");
    this.store.changeItem(data);
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

import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ToDoListItem } from '../to-do-list-item/to-do-list-item';
import { TuiRadioList } from '@taiga-ui/kit';
import { CommonModule } from '@angular/common';
import { Tooltip } from '../../directives';
import { IChStatusToDoItem, INewToDoItem, ISaveToDoItem } from '../../interfaces/interfaces';
import { ToastService } from '../../services/toast';
import { toSignal } from '@angular/core/rxjs-interop';
import { EStatus, EStatusInfo } from '../../enums/status';
import { ToDoCreateItem } from "../to-do-create-item/to-do-create-item";
import { UiSpinner, UiButton } from '../../library';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { type PolymorpheusContent} from '@taiga-ui/polymorpheus';
import { toDoStore } from '../../store/to-do-signal-store';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'backlog',
  imports: [ToDoListItem, ToDoCreateItem, UiSpinner, Tooltip, CommonModule, ReactiveFormsModule, TuiRadioList, RouterOutlet, UiButton, TranslateModule],
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
  protected readonly statusOptions = [
    { value: EStatus.All, text: EStatusInfo[EStatus.All].textKey },
    { value: EStatus.InProgress, text: EStatusInfo[EStatus.InProgress].textKey },
    { value: EStatus.Completed, text: EStatusInfo[EStatus.Completed].textKey },
  ];
  protected statusFilterControl = new FormControl<{ value: EStatus, text: string }>(this.statusOptions[1], { nonNullable: true });
  protected filter = toSignal(this.statusFilterControl.valueChanges, {
    initialValue: this.statusFilterControl.value
  });
  protected filteredList = computed(() => {
    const list = this.list();
    const filter = this.filter();
    return filter.value === EStatus.All ? list : list.filter((listItem) => listItem.status === filter.value);
  });

  get SelectedId(): number | null {
    const currentId = this.route.firstChild?.snapshot.paramMap.get("id");
    return !!currentId ? Number(currentId) : null;
  }

  get NoneToDoText(): string {
    switch (this.statusFilterControl.value.value) {
      case EStatus.InProgress:
        return "BACKLOG.IN_PROGRESS_LIST_EMPTY";
      case EStatus.Completed:
        return "BACKLOG.COMPLETED_LIST_EMPTY";
      default:
        return "BACKLOG.ALL_LIST_EMPTY";
    }
  }

  constructor() {
    effect(() => {
      this.store.switchStatusFilter(this.filter().value);
    });
  }

  ngOnInit(): void {
    this.requestList();
  }

  private requestList(): void {
    this.toast.showToast("TOAST.LOADING_TO_DO_LIST");
    this.store.loadList();
  }

  protected deleteItem(id: number): void {
    this.toast.showToast("TOAST.DELETING_TO_DO");
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
    this.toast.showToast("TOAST.SAVING_TO_DO");
    this.store.changeItem(data);
  }

  protected changeStatusItem(data: IChStatusToDoItem): void {
    this.store.changeItemStatus({id: data.id, status: data.status});
  }

  protected createItem(content: PolymorpheusContent<TuiDialogContext<INewToDoItem>>): void {
    this.dialogs.open(content).subscribe({
      next: (item) => {
        this.toast.showToast("TOAST.ADDING_NEW_TO_DO");
        this.store.addItem(item);
      },
    });
  }
}

import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ToDoListItem } from '../to-do-list-item/to-do-list-item';
import { TuiRadioList } from '@taiga-ui/kit';
import { CommonModule } from '@angular/common';
import { Tooltip } from '../../directives';
import { IChStatusToDoItem, INewToDoItem, ISaveToDoItem, IToDoItem } from '../../interfaces/interfaces';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { isEdit, isLoading, filteredToDoList } from '../../store/to-do-list-store/select';
import { addItem, changeItem, changeItemStatus, deleteItem, getList, isEditItem, switchStatusFilter } from '../../store/to-do-list-store/action';
import { ToastService } from '../../services/toast';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EStatus } from '../../enums/status';
import { ToDoCreateItem } from "../to-do-create-item/to-do-create-item";
import { UiSpinner, UiButton } from '../../library';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { type PolymorpheusContent} from '@taiga-ui/polymorpheus';

@Component({
  selector: 'backlog',
  imports: [ToDoListItem, ToDoCreateItem, UiSpinner, Tooltip, CommonModule, ReactiveFormsModule, TuiRadioList, RouterOutlet, UiButton],
  templateUrl: './backlog.html',
  styleUrl: './backlog.scss',
})
export class Backlog implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogs = inject(TuiDialogService);
  
  protected list$!: Observable<IToDoItem[]>;
  protected isEdit$!: Observable<boolean>;
  protected isLoading$!: Observable<boolean>;
  protected statusFilterControl = new FormControl<EStatus>(EStatus.InProgress, { nonNullable: true });
  protected readonly eStatus = EStatus;
  protected statusOptions = [
    this.eStatus.All,
    this.eStatus.InProgress,
    this.eStatus.Completed,
  ];

  get SelectedId(): number | null {
    const currentId = this.route.firstChild?.snapshot.paramMap.get("id");
    return !!currentId ? Number(currentId) : null;
  }

  get NoneToDoText(): string {
    if (this.statusFilterControl.value === this.eStatus.InProgress) return "Список не выполненых дел пуст!";
    if (this.statusFilterControl.value === this.eStatus.Completed) return "Список выполненых дел пуст!";
    return "Список дел пуст, добавьте новые дела!";
  }
  
  constructor(
    private store: Store,
    private toast: ToastService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.store.pipe(select(isLoading));
    this.list$ = this.store.pipe(select(filteredToDoList));
    this.isEdit$ = this.store.pipe(select(isEdit));
    this.statusFilterChangeSub();
    this.requestList();
  }

  private requestList(): void {
    this.toast.showToast("Загрузка дел...");
    this.store.dispatch(getList());
  }

  private statusFilterChangeSub(): void {
    this.statusFilterControl.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((value) => {
      this.store.dispatch(switchStatusFilter({status: value}));
    });
  }

  protected deleteItem(id: number): void {
    this.toast.showToast("Удаление дела...");
    this.store.dispatch(deleteItem({id: id}));
  }

  protected selectItem(id: number): void {
    this.store.dispatch(isEditItem({isEdit: false}));
    if (id === this.SelectedId) {
      this.router.navigate(['../'], {relativeTo: this.route});
    } else {
      this.router.navigate([id], {relativeTo: this.route});
    }
  }

  protected editItem(id: number): void {
    this.store.dispatch(isEditItem({isEdit: true}));
    this.router.navigate([id], {relativeTo: this.route});
  }

  protected saveItem(data: ISaveToDoItem): void {
    this.toast.showToast("Сохранение дела...");
    this.store.dispatch(changeItem({item: data}));
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

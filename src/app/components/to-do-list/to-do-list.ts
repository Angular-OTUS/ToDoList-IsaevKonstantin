import { Component, DestroyRef, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ToDoListItem } from '../to-do-list-item/to-do-list-item';
import { TuiExpand, TuiScrollbar, TuiTextfield } from '@taiga-ui/core';
import { TuiRadioList, TuiTextarea } from '@taiga-ui/kit';
import { CommonModule } from '@angular/common';
import { Tooltip } from '../../directives';
import { INewToDoItem, IToDoItem } from '../../interfaces/interfaces';
import { Observable, take, tap } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { descriptionSelected, isEdit, isLoading, selectedItemId, toDoList } from '../../store/to-do-list-store/select';
import { addItem, changeItem, changeItemStatus, deleteItem, editItem, getList, selectItem, switchStatusFilter } from '../../store/to-do-list-store/action';
import { ToastService } from '../../services/toast';
import { UiSpinner } from '../../library/ui-spinner/ui-spinner';
import { TStatus } from '../../types/types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EStatus } from '../../enums/status';
import { ToDoCreateItem } from "../to-do-create-item/to-do-create-item";

@Component({
  selector: 'to-do-list',
  imports: [ToDoListItem, ToDoCreateItem, UiSpinner, Tooltip, CommonModule, ReactiveFormsModule, TuiTextfield, TuiRadioList, TuiTextarea, TuiExpand, TuiScrollbar],
  templateUrl: './to-do-list.html',
  styleUrl: './to-do-list.scss',
})
export class ToDoList implements OnInit {
  @ViewChild('bodyList') bodyList!: ElementRef<HTMLDivElement>;

  private readonly destroyRef = inject(DestroyRef);
  
  protected height = 0;
  protected list$!: Observable<IToDoItem[]>;
  protected selectedItemId$!: Observable<number | null>;
  protected isEdit$!: Observable<boolean>;
  protected editedDescription$!: Observable<string>;
  protected isLoading$!: Observable<boolean>;
  protected textareaControl: FormControl<string> = new FormControl<string>("", {nonNullable: true});
  protected statusFilterControl = new FormControl<EStatus>(EStatus.All, { nonNullable: true });
  protected readonly eStatus = EStatus;
  protected statusOptions = [
    this.eStatus.All,
    this.eStatus.InProgress,
    this.eStatus.Completed,
  ];
  
  constructor(
    private store: Store,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.store.pipe(select(isLoading));
    this.isEdit$ = this.store.pipe(select(isEdit));
    this.list$ = this.store.pipe(select(toDoList));
    this.selectedItemId$ = this.store.pipe(select(selectedItemId));
    this.editedDescription$ = this.store.pipe(select(descriptionSelected));
    this.statusFilterControl.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((value) => {
      this.store.dispatch(switchStatusFilter({status: value}));
    });
    this.requestList();
  }

  private requestList(): void {
    this.toast.showToast("Загрузка дел...")
    this.store.dispatch(getList());
  }

  protected deleteItem(id: number): void {
    this.toast.showToast("Удаление дела...")
    this.store.dispatch(deleteItem({id: id}));
  }

  protected addItem(newItem: INewToDoItem): void {
    this.toast.showToast("Добавление нового дела...")
    this.store.dispatch(addItem({item: newItem}));
  }

  protected selectItem(id: number): void {
    this.store.dispatch(selectItem({id: id}));
    this.height = this.bodyList.nativeElement.offsetHeight - 12;
  }

  protected editItem(id: number): void {
    this.store.dispatch(editItem({id: id}));
    this.height = this.bodyList.nativeElement.offsetHeight - 12;
    this.editedDescription$.pipe(
      take(1),
      tap((text) => {
        this.textareaControl.setValue(text);
      }),
    ).subscribe();
  }

  protected saveItem(data: {id: number, text: string, status: TStatus}): void {
    this.toast.showToast("Сохранение дела...")
    const saveItem: IToDoItem = {
      id: data.id,
      text: data.text,
      description: this.textareaControl.value,
      status: data.status,
    };
    this.store.dispatch(changeItem({item: saveItem}));
  }

  protected changeStatusItem(data: {id: number, status: TStatus}): void {
    this.store.dispatch(changeItemStatus({id: data.id, status: data.status}));
  }
}

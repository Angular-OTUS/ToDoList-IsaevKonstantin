import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToDoListItem } from '../to-do-list-item/to-do-list-item';
import { TuiExpand, TuiLoader, tuiLoaderOptionsProvider, TuiScrollbar, TuiTextfield } from '@taiga-ui/core';
import { UiButton } from "../../library/ui-button/ui-button";
import { TuiTextarea } from '@taiga-ui/kit';
import { CommonModule } from '@angular/common';
import { Tooltip } from '../../directives';
import { NewToDoItem, ToDoItem } from '../../interfaces/interfaces';
import { Observable, take, tap } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { descriptionSelected, isEdit, isLoading, selectedItemId, toDoList } from '../../store/to-do-list-store/select';
import { addItem, changeItem, deleteItem, editItem, getList, selectItem } from '../../store/to-do-list-store/action';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'to-do-list',
  imports: [ToDoListItem, FormsModule, TuiTextfield, TuiTextarea, TuiLoader, TuiExpand, TuiScrollbar, UiButton, Tooltip, CommonModule],
  templateUrl: './to-do-list.html',
  styleUrl: './to-do-list.scss',
  providers: [
    tuiLoaderOptionsProvider({
      size: 'l',
      inheritColor: false,
      overlay: true,
    }),
  ],
})
export class ToDoList implements OnInit {
  @ViewChild('bodyList') bodyList!: ElementRef<HTMLDivElement>;

  protected height = 0;
  protected textValue = "";
  protected descriptionValue = "";
  protected descriptionNewValue = "";
  protected list$!: Observable<ToDoItem[]>;
  protected selectedItemId$!: Observable<number | null>;
  protected isEdit$!: Observable<boolean>;
  protected editedDescription$!: Observable<string>;
  protected isLoading$!: Observable<boolean>;
  
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

  protected addItem(newItem: NewToDoItem): void {
    this.toast.showToast("Добавление нового дела...")
    this.store.dispatch(addItem({item: newItem}));
    this.textValue = "";
    this.descriptionValue = "";
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
        this.descriptionNewValue = text;
      }),
    ).subscribe();
  }

  protected saveItem(event: ToDoItem, description: string): void {
    this.toast.showToast("Сохранение дела...")
    event.description = description;
    this.store.dispatch(changeItem({item: event}));
  }
}

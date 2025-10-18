import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { UiButton } from '../../library/ui-button/ui-button';
import { Tooltip } from '../../directives';
import { IChStatusToDoItem, ISaveToDoItem, IToDoItem } from '../../interfaces/interfaces';
import { TuiTextfield } from '@taiga-ui/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiCheckbox } from '@taiga-ui/kit';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';
import { EStatusInfo } from '../../enums/status';

@Component({
  selector: 'to-do-list-item',
  imports: [UiButton, Tooltip, FormsModule, ReactiveFormsModule, TuiCheckbox, TuiTextfield],
  templateUrl: './to-do-list-item.html',
  styleUrl: './to-do-list-item.scss',
})
export class ToDoListItem implements OnInit {
  @Input({required: true}) item!: IToDoItem;
  @Input() isEdit: boolean = false;
  @Output() deleteItemEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output() selectItemEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output() editItemEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output() saveItemEvent: EventEmitter<ISaveToDoItem> = new EventEmitter<ISaveToDoItem>();
  @Output() changeStatusEvent: EventEmitter<IChStatusToDoItem> = new EventEmitter<IChStatusToDoItem>();
  
  private clickTimeout?: number;
  private readonly destroyRef = inject(DestroyRef);

  protected readonly eStatusInfo = EStatusInfo;
  protected textControl = new FormControl<string>("", {nonNullable: true});
  protected statusControl = new FormControl<boolean>(false, {nonNullable: true});

  constructor() {}

  ngOnInit(): void {
    this.initControlsValue();
    this.statusChangeSub();
  }

  private initControlsValue(): void {
    this.textControl.setValue(this.item.text);
    this.statusControl.setValue(this.eStatusInfo[this.item.status].value);
  }

  private statusChangeSub(): void {
    this.statusControl.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef), 
      debounceTime(500),
    ).subscribe(
      (value) => {
        this.changeStatusEvent.emit({id: this.item.id, status: value ? "Completed" : "InProgress"});
      },
    );
  }
  
  protected outDeleteEmitter(): void {
    this.deleteItemEvent.emit(this.item.id);
  }

  protected outSelecteEmitter(): void {
    clearTimeout(this.clickTimeout);
    this.clickTimeout = setTimeout(() => {
      this.selectItemEvent.emit(this.item.id);
    }, 500);
  }

  protected outEditEmitter(): void {
    clearTimeout(this.clickTimeout);
    this.editItemEvent.emit(this.item.id);
  }

  protected outSaveEmitter(): void {
    this.saveItemEvent.emit({id: this.item.id, text: this.textControl.value, status: this.statusControl.value ? "Completed" : "InProgress"});
  }
}

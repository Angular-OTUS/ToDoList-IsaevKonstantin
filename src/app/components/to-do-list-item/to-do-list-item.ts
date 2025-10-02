import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UiButton } from '../../library/ui-button/ui-button';
import { Tooltip } from '../../directives';
import { ToDoItem } from '../../interfaces/interfaces';
import { TuiTextfield } from '@taiga-ui/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'to-do-list-item',
  imports: [UiButton, Tooltip, TuiTextfield, FormsModule],
  templateUrl: './to-do-list-item.html',
  styleUrl: './to-do-list-item.scss',
})
export class ToDoListItem {
  @Input({required: true}) item!: ToDoItem;
  @Input() isEdit: boolean = false;
  @Output() deleteItemEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output() selectItemEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output() editItemEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output() saveItemEvent: EventEmitter<ToDoItem> = new EventEmitter<ToDoItem>();

  protected textValue = "";

  private clickTimeout: any;
  
  protected outDeleteEmitter(id: number): void {
    this.deleteItemEvent.emit(id);
  }

  protected outSelecteEmitter(id: number): void {
    clearTimeout(this.clickTimeout);
    this.clickTimeout = setTimeout(() => {
      this.selectItemEvent.emit(id);
    }, 500);
  }

  protected outEditEmitter(id: number): void {
    clearTimeout(this.clickTimeout);
    this.textValue = this.item.text;
    this.editItemEvent.emit(id);
  }

  protected outSaveEmitter(id: number, text: string): void {
    this.saveItemEvent.emit({
      id: id,
      text: text,
      description: "",
    });
  }
}

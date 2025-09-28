import { Component, EventEmitter, Input, Output } from '@angular/core';
import { toDoItem } from '../to-do-list/to-do-list';
import { UiButton } from '../../library/ui-button/ui-button';
import { Tooltip } from '../../directives';

@Component({
  selector: 'to-do-list-item',
  imports: [UiButton, Tooltip],
  templateUrl: './to-do-list-item.html',
  styleUrl: './to-do-list-item.scss',
})
export class ToDoListItem {
  @Input({required: true}) item!: toDoItem;
  @Output() deleteItemEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output() selectItemEvent: EventEmitter<number> = new EventEmitter<number>();

  protected outDeleteEmitter(id: number): void {
    this.deleteItemEvent.emit(id);
  }

  protected outSelecteEmitter(id: number): void {
    this.selectItemEvent.emit(id);
  }
}

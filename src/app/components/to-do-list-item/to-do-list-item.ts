import { Component, EventEmitter, Input, Output } from '@angular/core';
import { toDoItem } from '../to-do-list/to-do-list';

@Component({
  selector: 'to-do-list-item',
  imports: [],
  templateUrl: './to-do-list-item.html',
  styleUrl: './to-do-list-item.scss'
})
export class ToDoListItem {
  @Input({required: true}) item!: toDoItem;
  @Output() deleteItemEvent: EventEmitter<number> = new EventEmitter<number>();

  protected outDeleteEmitter(id: number) {
    this.deleteItemEvent.emit(id);
  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-to-do-list',
  imports: [],
  templateUrl: './to-do-list.html',
  styleUrl: './to-do-list.scss'
})
export class ToDoListComponent {
  protected list: string[] = ["Проснуться", "Купить йогурт"];

  protected deleteItem(index: number): void {
    this.list.splice(index, 1);
  }

  protected addItem(item: string): void {
    if (!item.length) return;
    this.list.push(item);
  }
}

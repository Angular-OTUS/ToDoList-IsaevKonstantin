import { Component } from '@angular/core';

interface toDoItem {
  id: number,
  title: string,
}

@Component({
  selector: 'app-to-do-list',
  imports: [],
  templateUrl: './to-do-list.html',
  styleUrl: './to-do-list.scss'
})
export class ToDoListComponent {
  protected list: toDoItem[] = [{id: 0, title: "Проснуться"}, {id: 1, title:  "Купить йогурт"}];
  private nextId: number = this.list.length;

  protected deleteItem(index: number): void {
    this.list = this.list.filter((item: toDoItem) => item.id !== index);
  }

  protected addItem(title: string): void {
    if (title.trim()) {
      this.list.push({
        id: this.nextId++,
        title: title,
      })
    }
  }
}

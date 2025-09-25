import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToDoListItem } from '../to-do-list-item/to-do-list-item';
import { TuiLoader, tuiLoaderOptionsProvider, TuiTextfield } from '@taiga-ui/core';
import { UiButton } from "../../library/ui-button/ui-button";

export interface toDoItem {
  id: number,
  text: string,
}

@Component({
  selector: 'to-do-list',
  imports: [ToDoListItem, FormsModule, TuiTextfield, TuiLoader, UiButton],
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
  protected list: toDoItem[] = [{id: 0, text: "Проснуться"}, {id: 1, text:  "Купить йогурт"}];
  protected inputValue = "";
  protected isLoading = true;

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  protected deleteItem(index: number): void {
    this.list = this.list.filter((item: toDoItem) => item.id !== index);
  }

  protected addItem(text: string): void {
    if (text.trim()) {
      const nextId: number = this.list.length ? Math.max(...this.list.map(item => item.id)) + 1 : 0;
      this.list.push({
        id: nextId,
        text: text,
      })
      this.inputValue = "";
    }
  }
}

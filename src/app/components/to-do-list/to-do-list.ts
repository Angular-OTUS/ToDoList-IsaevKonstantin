import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToDoListItem } from '../to-do-list-item/to-do-list-item';
import { TuiExpand, TuiLoader, tuiLoaderOptionsProvider, TuiScrollbar, TuiTextfield } from '@taiga-ui/core';
import { UiButton } from "../../library/ui-button/ui-button";
import { TuiTextarea } from '@taiga-ui/kit';
import { CommonModule } from '@angular/common';
import { Tooltip } from '../../directives';

export interface toDoItem {
  id: number,
  text: string,
  description: string,
  isShow: boolean,
}

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

  protected list: toDoItem[] = [
    {id: 0, text: "Проснуться", description: "Завтра рано вставать на работу, поэтому вважно успеть собраться, чтобы придти во ввремя.", isShow: false}, 
    {id: 1, text:  "Купить йогурт", description: "Жена попросила купить йогурт, зайти в магазин после работы.", isShow: false},
  ];
  protected textValue = "";
  protected descriptionValue = "";
  protected selectedItemId: number | null = null;
  protected isLoading = true;
  protected height = 0;

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

  protected deleteItem(index: number): void {
    if (index === this.selectedItemId) {
      this.selectedItemId = null;
    }
    this.list = this.list.filter((item: toDoItem) => item.id !== index);
  }

  protected addItem(text: string, description: string): void {
    if (text.trim()) {
      const nextId: number = this.list.length ? Math.max(...this.list.map(item => item.id)) + 1 : 0;
      this.list.push({
        id: nextId,
        text: text,
        description: description,
        isShow: false,
      })
      this.textValue = "";
      this.descriptionValue = "";
    }
  }

  protected selectItem(id: number): void {
    if (id === this.selectedItemId) {
      this.selectedItemId = null;
    } else {
      this.selectedItemId = id;
      this.height = this.bodyList.nativeElement.offsetHeight - 1;
    }
  }

  protected getDescription(id: number | null): string {
    return this.list.find((item: toDoItem) => item.id  === id)?.description || "";
  }
}

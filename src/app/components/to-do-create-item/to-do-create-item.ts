import { Component, EventEmitter, inject, Output } from '@angular/core';
import { UiButton } from '../../library/ui-button/ui-button';
import { TuiExpand, TuiTextfield } from '@taiga-ui/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { INewToDoItem } from '../../interfaces/interfaces';
import { TuiTextarea } from '@taiga-ui/kit';

@Component({
  selector: 'to-do-create-item',
  imports: [UiButton, ReactiveFormsModule, TuiExpand, TuiTextfield, TuiTextarea],
  templateUrl: './to-do-create-item.html',
  styleUrl: './to-do-create-item.scss'
})
export class ToDoCreateItem {
  @Output() addNewItemEvent: EventEmitter<INewToDoItem> = new EventEmitter<INewToDoItem>();

  private fb = inject(FormBuilder);

  protected form: FormGroup = this.fb.group({
    text: ["", [Validators.required, Validators.minLength(1)]],
    description: [""],
  });

  protected onSubmit(): void {
    const {text, description} = this.form.value;
    this.addNewItemEvent.emit({text: text, description: description});
  }
}

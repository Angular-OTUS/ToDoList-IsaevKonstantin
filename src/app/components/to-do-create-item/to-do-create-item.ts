import { Component, Inject, inject } from '@angular/core';
import { UiButton } from '../../library/ui-button/ui-button';
import { TuiDialogContext, TuiExpand, TuiTextfield } from '@taiga-ui/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { INewToDoItem } from '../../interfaces/interfaces';
import { TuiTextarea } from '@taiga-ui/kit';
import {POLYMORPHEUS_CONTEXT } from '@taiga-ui/polymorpheus';

@Component({
  selector: 'to-do-create-item',
  imports: [UiButton, ReactiveFormsModule, TuiExpand, TuiTextfield, TuiTextarea],
  templateUrl: './to-do-create-item.html',
  styleUrl: './to-do-create-item.scss'
})
export class ToDoCreateItem {
  private fb = inject(FormBuilder);

  protected form: FormGroup = this.fb.group({
    text: ["", [Validators.required, Validators.minLength(1)]],
    description: [""],
  });

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<INewToDoItem>,
  ) {}

  protected onSubmit(): void {
    const {text, description} = this.form.value;
    this.context.completeWith({text: text, description: description});
  }
}

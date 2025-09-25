import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ui-button',
  imports: [],
  template: `
    <button (click)="clickEmitter()">{{ title }}</button>
  `,
  styleUrl: './ui-button.scss',
})
export class UiButton {
  @Input() title?: string;
  @Output() outClickEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  public clickEmitter() {
    this.outClickEmitter.emit(true);
  }
}

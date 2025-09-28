import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ui-button',
  imports: [],
  template: `
    <button (click)="clickEmitter($event)">{{ title }}</button>
  `,
  styleUrl: './ui-button.scss',
})
export class UiButton {
  @Input() title?: string;
  @Output() outClickEmitter: EventEmitter<Event> = new EventEmitter<Event>();

  public clickEmitter(event: Event) {
    event.stopPropagation();
    this.outClickEmitter.emit(event);
  }
}

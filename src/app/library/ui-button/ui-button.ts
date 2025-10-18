import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'ui-button',
  imports: [],
  templateUrl: './ui-button.html',
  styleUrl: './ui-button.scss',
})
export class UiButton {
  @Output() outClickEmitter: EventEmitter<Event> = new EventEmitter<Event>();

  public clickEmitter(event: Event) {
    event.stopPropagation();
    this.outClickEmitter.emit(event);
  }
}

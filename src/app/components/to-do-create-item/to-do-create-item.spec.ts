import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToDoCreateItem } from './to-do-create-item';

describe('ToDoCreateItem', () => {
  let component: ToDoCreateItem;
  let fixture: ComponentFixture<ToDoCreateItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToDoCreateItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToDoCreateItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

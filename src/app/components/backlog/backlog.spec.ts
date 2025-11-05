import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Backlog } from './backlog';

describe('Backlog', () => {
  let component: Backlog;
  let fixture: ComponentFixture<Backlog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Backlog],
    })
    .compileComponents();

    fixture = TestBed.createComponent(Backlog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

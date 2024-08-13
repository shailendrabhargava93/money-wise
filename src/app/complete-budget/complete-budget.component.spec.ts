import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteBudgetComponent } from './complete-budget.component';

describe('CompleteBudgetComponent', () => {
  let component: CompleteBudgetComponent;
  let fixture: ComponentFixture<CompleteBudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompleteBudgetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompleteBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

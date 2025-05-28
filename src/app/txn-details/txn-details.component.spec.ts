import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TxnDetailsComponent } from './txn-details.component';

describe('TxnDetailsComponent', () => {
  let component: TxnDetailsComponent;
  let fixture: ComponentFixture<TxnDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TxnDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TxnDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

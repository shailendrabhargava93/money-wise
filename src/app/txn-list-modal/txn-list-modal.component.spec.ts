import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TxnListModalComponent } from './txn-list-modal.component';

describe('TxnListModalComponent', () => {
  let component: TxnListModalComponent;
  let fixture: ComponentFixture<TxnListModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TxnListModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TxnListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

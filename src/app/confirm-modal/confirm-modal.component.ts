import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { STATUS } from './../status.enum';
import { AppService } from './../app.service';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css'],
})
export class ConfirmModalComponent {
  @Input() action!: string;
  @Input() budgetId!: string;
  @Input() visible: boolean = false;
  @Output() closeModal: EventEmitter<any> = new EventEmitter<any>();
  isDeleteAction = false;
  isCompleteAction = false;

  constructor(
    private app: AppService,
    private router: Router,
    private notification: NzMessageService
  ) {}
  close(): void {
    this.visible = false;
    this.closeModal.emit(this.visible);
  }

  confirm() {
    if (this.action === 'delete') {
      this.markDeleted();
    } else {
      this.markCompleted();
    }
    this.closeModal.emit(false);
  }

  markCompleted() {
    this.app.showSpinner();
    const budgetId = this.budgetId;
    const data = { status: STATUS.COMPLETED };
    this.app.update(budgetId, data).subscribe(
      (data) => {
        if (data) {
          this.app.hideSpinner();
          this.notification.success('Mark Completed !');
          this.router.navigate(['budgets']);
        }
      },
      (error) => {
        this.app.hideSpinner();
        console.error('An error occurred:', error);
        this.notification.error('An error occurred while updating.');
      }
    );
  }

  markDeleted() {
    this.app.showSpinner();
    const budgetId = this.budgetId;
    const data = { status: STATUS.DELETED };
    this.app.update(budgetId, data).subscribe(
      (data) => {
        if (data) {
          this.app.hideSpinner();
          this.notification.success('Mark Deleted !');
          this.router.navigate(['budgets']);
        }
      },
      (error) => {
        this.app.hideSpinner();
        console.error('An error occurred:', error);
        this.notification.error('An error occurred while updating.');
      }
    );
  }
}

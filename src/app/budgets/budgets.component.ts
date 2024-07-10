import { STATUS } from './../status.enum';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from './../app.service';
import { Component, OnInit } from '@angular/core';
import { catchError, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.css'],
})
export class BudgetsComponent implements OnInit {
  budgets: any[] = [];
  isVisible = false;
  isConfirmLoading = false;
  userEmail: string | null = null;
  budgetId: string | null = null;
  users!: any[];

  constructor(
    private app: AppService,
    private notification: NzMessageService
  ) {}

  ngOnInit() {
    this.app.showSpinner();

    this.app.userEmail
      .pipe(
        switchMap((user) => this.app.getBudgets(user as string)),
        catchError((error) => {
          console.error('Error occurred getBudgets:', error);
          this.app.hideSpinner();
          return of([]);
        })
      )
      .subscribe((data) => {
        if (data) {
          this.app.hideSpinner();
          this.budgets = data as any;
        }
      });
  }

  onshare(budgetId: string, users: string[], createdBy: string) {
    this.isVisible = true;
    this.budgetId = budgetId;
    this.users = this.modifyrUsers(users, createdBy);
  }

  modifyrUsers(users: string[], createdBy: string) {
    return users.map((user) => {
      if (user !== createdBy) {
        return { email: user, delete: true };
      } else {
        return { email: user, delete: false };
      }
    });
  }

  oncancel() {
    this.isVisible = !this.isVisible;
    this.budgetId = null;
    this.userEmail = null;
    this.users = [];
  }

  handleShare() {
    if (this.userEmail && this.budgetId) {
      this.budgetId = this.budgetId as string;
      this.userEmail = this.userEmail as string;
      if (!this.userEmail?.includes('@gmail.com')) {
        this.notification.error('Please enter valid gmail id');
        return;
      }
      this.app.showSpinner();
      this.isConfirmLoading = true;
      this.app.share(this.budgetId, this.userEmail).subscribe(
        (data) => {
          if (data) {
            this.app.hideSpinner();
            this.isConfirmLoading = false;
            this.notification.success('Invitation sent !');
            this.oncancel();
          }
        },
        (error) => {
          this.app.hideSpinner();
          console.error('An error occurred:', error);
          this.notification.error('An error occurred while Sending invite.');
        }
      );
    } else {
      this.notification.error('Please enter valid gmail id');
    }
  }

  getSpentPerc(budget: any) {
    return Math.round(
      (budget.data.spentAmount / budget.data.totalBudget) * 100
    );
  }

  markCompleted() {
    this.app.showSpinner();
    this.budgetId = this.budgetId as string;
    this.app.update(this.budgetId, STATUS.COMPLETED).subscribe(
      (data) => {
        if (data) {
          this.app.hideSpinner();
          this.notification.success('updated successfully !');
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
    this.budgetId = this.budgetId as string;
    this.app.update(this.budgetId, STATUS.DELETED).subscribe(
      (data) => {
        if (data) {
          this.app.hideSpinner();
          this.notification.success('updated successully !');
        }
      },
      (error) => {
        this.app.hideSpinner();
        console.error('An error occurred:', error);
        this.notification.error('An error occurred while updating.');
      }
    );
  }

  confirm(budgetId: string, type: string): void {
    this.budgetId = budgetId;
    if (type === 'delete') {
      this.markDeleted();
    }

    if (type === 'complete') {
      this.markCompleted();
    }
  }
}

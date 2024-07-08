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
  budgets!: any[];
  isVisible = false;
  isConfirmLoading = false;
  userEmail: string | null = null;
  budgetId: string | null = null;
  users!: string[];

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

  onshare(budgetId: string, users: string[]) {
    this.isVisible = true;
    this.budgetId = budgetId;
    this.users = users;
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
      this.isConfirmLoading = true;
      this.app.share(this.budgetId, this.userEmail).subscribe((data) => {
        if (data) {
          this.isConfirmLoading = false;
          this.notification.success('Invitation sent !');
          this.oncancel();
        }
      });
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
    this.budgetId = this.budgetId as string;
    const status = 'completed';
    this.app.update(this.budgetId, status).subscribe((data) => {
      if (data) {
        this.notification.success('updated successully !');
      }
    });
  }

  markDeleted() {
    this.budgetId = this.budgetId as string;
    const status = 'deleted';
    this.app.update(this.budgetId, status).subscribe((data) => {
      if (data) {
        this.notification.success('updated successully !');
      }
    });
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

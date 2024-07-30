import { STATUS } from './../status.enum';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from './../app.service';
import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-budget-overview',
  templateUrl: './budget-overview.component.html',
  styleUrls: ['./budget-overview.component.css'],
})
export class BudgetOverviewComponent {
  budgetId!: string;
  budgetData!: any;
  currency = this.app.currency$;
  constructor(
    private app: AppService,
    private route: ActivatedRoute,
    private notification: NzMessageService
  ) {}

  ngOnInit() {
    this.budgetId = this.route.snapshot.paramMap.get('id') as string;
    if (this.budgetId) {
      this.getBudget(this.budgetId);
    }
  }

  getBudget(id: string) {
    this.app.showSpinner();
    this.app.getBudgetById(id).subscribe((data) => {
      if (data) {
        this.app.hideSpinner();
        this.budgetData = data;
        this.budgetData['overspent'] = this.isOverspent(data);
      }
    });
  }

  isOverspent(budget: any) {
    return budget.totalBudget - budget.spentAmount < 0 ? true : false;
  }

  confirm(type: string): void {
    if (type === 'delete') {
      this.markDeleted();
    }

    if (type === 'complete') {
      this.markCompleted();
    }
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

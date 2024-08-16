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
  action!: string;
  visible = false;
  constructor(private app: AppService, private route: ActivatedRoute) {}

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

  onAction(type: string): void {
    if (type === 'delete') {
      this.action = type;
    }

    if (type === 'complete') {
      this.action = type;
    }
    this.visible = true;
  }

  close() {
    this.visible = false;
  }
}

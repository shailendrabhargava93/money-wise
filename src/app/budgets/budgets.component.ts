import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  budgets!: any[];
  isVisible = false;
  isConfirmLoading = false;
  users!: any[];

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private app: AppService,
    private notification: NzMessageService
  ) {
    this.form = this.fb.group({
      email: [
        null,
        [
          Validators.required,
          Validators.pattern('^[a-z0-9](.?[a-z0-9]){5,}@gmail.com$'),
        ],
      ],
      budgetId: [null],
    });
  }

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
    this.form.get('budgetId')?.setValue(budgetId);
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
    this.form.get('budgetId')?.setValue(null);
    this.form.get('email')?.setValue(null);
    this.users = [];
    this.isConfirmLoading = false;
  }

  handleShare() {
    if (this.form.valid) {
      const form = this.form.value;
      const budgetId = this.form.get('budgetId')?.value;
      this.app.showSpinner();
      this.isConfirmLoading = true;
      const data = { users: [form.email] };
      this.app.update(budgetId, data).subscribe(
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
          this.isConfirmLoading = false;
          console.error('An error occurred:', error);
          this.notification.error('An error occurred while Sending invite.');
        }
      );
    } else {
      Object.values(this.form.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  getSpentPerc(budget: any) {
    return Math.round(
      (budget.data.spentAmount / budget.data.totalBudget) * 100
    );
  }

  markCompleted() {
    this.app.showSpinner();
    const budgetId = this.form.get('budgetId')?.value;
    const data = { status: STATUS.COMPLETED };
    this.app.update(budgetId, data).subscribe(
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
    const budgetId = this.form.get('budgetId')?.value;
    const data = { status: STATUS.DELETED };
    this.app.update(budgetId, data).subscribe(
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
    this.form.get('budgetId')?.setValue(budgetId);
    if (type === 'delete') {
      this.markDeleted();
    }

    if (type === 'complete') {
      this.markCompleted();
    }
  }

  isOverspent(budget: any) {
    return budget.data.totalBudget - budget.data.spentAmount < 0 ? true : false;
  }
}

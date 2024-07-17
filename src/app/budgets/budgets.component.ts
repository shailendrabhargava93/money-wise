import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { STATUS } from './../status.enum';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from './../app.service';
import { Component, OnInit } from '@angular/core';
import { catchError, of, switchMap } from 'rxjs';

import emailjs from '@emailjs/browser';

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

  currentUser!: string;
  selectedBudgetName!: string;

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private app: AppService,
    private notification: NzMessageService,
    private router: Router
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

    this.app.userName.subscribe((e) => {
      this.currentUser = e as string;
    });

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

  onShare(
    budgetName: string,
    budgetId: string,
    users: string[],
    createdBy: string
  ) {
    this.isVisible = true;
    this.selectedBudgetName = budgetName;
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

  handleShare(email?: string) {
    if (email) {
      this.form.get('email')?.setValue(email);
    }
    if (this.form.valid) {
      const form = this.form.value;
      const budgetId = this.form.get('budgetId')?.value;
      //for remove pass email id
      let modifiedUsers;
      if (email) {
        modifiedUsers = this.users
          .filter((e) => e.email != form.email)
          .map((b) => b.email);
        console.log('removed');
      } else {
        this.isConfirmLoading = true;
        modifiedUsers = this.users.map((e) => e.email);
        modifiedUsers.push(form.email);
        console.log('added');
      }
      const data = { users: modifiedUsers };
      this.app.update(budgetId, data).subscribe(
        (data) => {
          if (data) {
            this.isConfirmLoading = false;
            if (email) {
              this.notification.success('User Removed !');
            } else {
              this.notification.success('Invitation sent !');

              if (this.selectedBudgetName && form.email) {
                this.sendEmail(
                  this.currentUser,
                  form.email,
                  form.email,
                  this.selectedBudgetName
                );
              } else {
                console.log('budget not selected or email is invalid');
              }
            }
            this.form.reset();
            this.oncancel();
            this.reloadCurrentRoute();
          }
        },
        (error) => {
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
          this.notification.success('Mark Completed !');
          this.reloadCurrentRoute();
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
          this.notification.success('Mark Deleted !');
          this.reloadCurrentRoute();
        }
      },
      (error) => {
        this.app.hideSpinner();
        console.error('An error occurred:', error);
        this.notification.error('An error occurred while updating.');
      }
    );
  }

  removeUser(email: string) {
    this.handleShare(email);
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

  reloadCurrentRoute() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  sendEmail(from: string, toName: string, toEmail: string, budgetName: string) {
    var templateParams = {
      budget_name: budgetName,
      from_name: from,
      to_name: toName,
      toEmail: toEmail,
    };

    emailjs
      .send('service_qbeg4sl', 'template_0gee8ww', templateParams, {
        publicKey: 'ZZIokmaL8NAWGBmSN',
      })
      .then(
        (response: any) => {
          console.log('EMAIL SUCCESS!', response.status, response.text);
        },
        (err: any) => {
          console.log('EMAIL FAILED...', err);
        }
      );
  }
}

import { ActivatedRoute, Router } from '@angular/router';
import { CAT_ICON } from './../category-icons';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from './../app.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.css'],
})
export class AddTransactionComponent implements OnInit {
  form: FormGroup;
  categories: any[] = [];
  userEmail$ = this.app.userEmail;
  budgets!: any[] | undefined;
  txnId: string | null = null;
  isUpdate = false;
  constructor(
    private fb: FormBuilder,
    private app: AppService,
    private message: NzMessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      title: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      category: [null, [Validators.required]],
      date: [null, [Validators.required]],
      user: [null],
      budgetId: [null, [Validators.required]],
    });
  }

  ngOnInit() {
    this.userEmail$.subscribe((user) =>
      this.form.controls['user'].setValue(user)
    );

    this.app.budgetValues.subscribe((values) => {
      this.budgets = values;
      if (this.budgets?.length === 1) {
        this.form.controls['budgetId'].setValue(this.budgets[0].id);
      }
    });

    for (var n in CAT_ICON) {
      const icon = CAT_ICON[n as keyof typeof CAT_ICON];
      this.categories.push({ name: n, icon: `/assets/icons/${icon}.png` });
    }
    this.categories.sort((a, b) =>
      a.name > b.name ? 1 : b.name > a.name ? -1 : 0
    );
    const date = new Date();
    this.form.controls['date'].setValue(date);

    this.txnId = this.route.snapshot.paramMap.get('id');
    if (this.txnId) {
      this.getTxn(this.txnId);
    }
  }

  submitForm(): void {
    if (this.form.valid) {
      this.app.showSpinner();
      this.app.createTransaction(this.form.value).subscribe(
        (res) => {
          if (res) {
            this.app.hideSpinner();
            this.message.success(`Transaction added !`);
            this.router.navigate(['transactions']);
          }
        },
        (err) => {
          this.app.hideSpinner();
          console.error(err);
          this.message.error(`An error occurred: ${err.message}`);
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

  getTxn(txnId: string) {
    this.app.showSpinner();
    this.app.getTxnById(txnId).subscribe((data) => {
      if (data) {
        this.app.hideSpinner();
        this.form.patchValue(data);
        this.isUpdate = true;
      }
    });
  }

  updateTxn() {
    if (this.form.valid) {
      this.app.showSpinner();
      this.app.updateTransaction(this.txnId, this.form.value).subscribe(
        (res) => {
          if (res) {
            this.app.hideSpinner();
            this.message.success(`Transaction updated !`);
            this.router.navigate(['transactions']);
          }
        },
        (err) => {
          this.app.hideSpinner();
          console.error(err);
          this.message.error(`An error occurred: ${err.message}`);
        }
      );
    }
  }
}

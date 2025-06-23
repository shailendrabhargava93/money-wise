import { CAT_ICON } from './../category-config';
import { STATUS } from './../status.enum';
import { switchMap, catchError, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
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
  txnForm: FormGroup;
  categories: any[] = [];
  userEmail$ = this.app.userEmail;
  currency = this.app.currency$;
  budgets!: any[];
  labels!: any[];
  txnId: string | null = null;
  isUpdate = false;
  dateSuggestions!: string[];
  expesneSuggestions!: string[];
  dateFormat = 'dd-MMM-yyyy';
  constructor(
    private fb: FormBuilder,
    private app: AppService,
    private message: NzMessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.txnForm = this.fb.group({
      title: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      category: [null, [Validators.required]],
      date: [null, [Validators.required]],
      user: [null],
      label: [null, [Validators.required]],
      budgetId: [null, [Validators.required]],
    });
  }

  ngOnInit() {
    this.userEmail$.subscribe((user) =>
      this.txnForm.controls['user'].setValue(user)
    );
    this.app.showSpinner();
    this.app.userEmail
      .pipe(
        switchMap((user) => this.app.getBudgets(user as string, STATUS.ACTIVE)),
        catchError((error) => {
          console.error('Error occurred getBudgets:', error);
          this.app.hideSpinner();
          return of([]);
        })
      )
      .subscribe((data) => {
        this.app.hideSpinner();
        if (data) {
          this.budgets = (data as any[]).map((el) => {
            return {
              id: el.id,
              name: el.data.name,
            };
          });
          if (this.budgets?.length === 1) {
            this.txnForm.controls['budgetId'].setValue(this.budgets[0].id);
          }
        }
      });

    this.app.userEmail
      .pipe(
        switchMap((user) => this.app.getLabels(user as string)),
        catchError((error) => {
          console.error('Error occurred getLabels:', error);
          this.app.hideSpinner();
          return of([]);
        })
      )
      .subscribe((data) => {
        this.app.hideSpinner();
        const labels = data as any[];
        if (labels.length > 0) {
          this.labels = data as string[];
        } else {
          this.labels = ['Not available'];
        }
      });

    for (var cat in CAT_ICON) {
      const icon = CAT_ICON[cat as keyof typeof CAT_ICON];
      this.categories.push({ name: cat, icon: icon });
    }
    this.categories.sort((a, b) =>
      a.name > b.name ? 1 : b.name > a.name ? -1 : 0
    );
    const date = new Date();
    this.txnForm.controls['date'].setValue(date);

    this.txnForm.controls['category'].setValue('Other');

    this.dateSuggestions = ['yesterday', 'tommorrow'];

    this.app.getJSON().subscribe((data) => {
      this.txnForm.get('category')?.valueChanges.subscribe((value) => {
        if (value) {
          const filtered = data.filter((el: any) => el.key === value);
          this.expesneSuggestions =
            filtered.length > 0 ? filtered[0].values : null;
          if (this.expesneSuggestions) {
            this.expesneSuggestions = this.shuffle(this.expesneSuggestions);
          }
        }
      });
    });

    this.txnId = this.route.snapshot.paramMap.get('id');
    if (this.txnId) {
      this.getTxn(this.txnId);
    }
  }

  shuffle = (array: string[]) => {
    return array.sort(() => Math.random() - 0.5);
  };

  get selectedCatIcon() {
    const icon =
      CAT_ICON[this.txnForm.get('category')?.value as keyof typeof CAT_ICON];
    return icon;
  }

  submitForm(): void {
    if (this.txnForm.valid) {
      this.app.showSpinner();
      this.app.createTransaction(this.txnForm.value).subscribe(
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
      Object.values(this.txnForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  onClick(exp: string) {
    this.txnForm.controls['title'].setValue(exp);
  }

  getTxn(txnId: string) {
    this.app.showSpinner();
    this.app.getTxnById(txnId).subscribe((data) => {
      if (data) {
        this.app.hideSpinner();
        this.txnForm.patchValue(data);
        this.isUpdate = true;
      }
    });
  }

  updateTxn() {
    if (this.txnForm.valid) {
      this.app.showSpinner();
      this.app.updateTransaction(this.txnId, this.txnForm.value).subscribe(
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

  deleteTxn() {
    this.app.deleteTransaction(this.txnId).subscribe(
      (res) => {
        if (res) {
          this.app.hideSpinner();
          this.message.success(`Transaction Deleted !`);
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

  onDateClick(date: string) {
    const today = new Date();
    const yesterday = new Date(new Date().setDate(today.getDate() - 1));
    const tommorrow = new Date(new Date().setDate(today.getDate() + 1));
    if (date === 'yesterday') {
      this.txnForm.controls['date'].setValue(yesterday);
    }
    if (date === 'tommorrow') {
      this.txnForm.controls['date'].setValue(tommorrow);
    }
  }
}

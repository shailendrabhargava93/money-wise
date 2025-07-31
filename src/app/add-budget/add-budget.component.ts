import { STATUS } from './../status.enum';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from './../app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-add-budget',
  templateUrl: './add-budget.component.html',
  styleUrls: ['./add-budget.component.css'],
})
export class AddBudgetComponent {
  isUpdate = false;
  form: FormGroup;
  userEmail$ = this.app.userEmail;
  currency = this.app.currency$;
  budgetNameSuggestions!: string[];
  budgetAmountSuggestions!: number[];
  dateFormat = 'dd-MMM-yyyy';
  budgetId: string | null = null;
  @Input() fromSetup = false;
  enableCompleteSetup = false;

  constructor(
    private fb: FormBuilder,
    private app: AppService,
    private message: NzMessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      name: [null, [Validators.required]],
      totalBudget: [null, [Validators.required]],
      createdBy: [null],
      status: [STATUS.ACTIVE],
    });
  }

  ngOnInit() {
    this.userEmail$.subscribe((user) =>
      this.form.controls['createdBy'].setValue(user)
    );
    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.form.get('startDate')?.setValue(firstDay);
    this.form.get('endDate')?.setValue(lastDay);

    const opt1 = date.toLocaleString('en-US', { month: 'short' });
    const opt2 = date.toLocaleString('en-US', { month: 'long' });
    const opt3 = date.toLocaleString('en-US', { year: '2-digit' });

    this.budgetNameSuggestions = [
      `${opt1} ${date.getFullYear()}`,
      `${opt2} ${date.getFullYear()}`,
      `Month ${opt1}`,
      `${opt1} ${opt3}`,
    ];

    this.budgetAmountSuggestions = [10000, 20000, 25000, 30000];
    this.budgetId = this.route.snapshot.paramMap.get('id');
    if (this.budgetId) {
      this.getBudget(this.budgetId);
    }
  }
  createBudget(): void {
    if (this.form.valid) {
      this.app.showSpinner();
      this.app.createBudget(this.form.value).subscribe(
        (res) => {
          if (res) {
            this.app.hideSpinner();
            this.message.success(`Budget created !`);
            if (!this.fromSetup) {
              this.router.navigate(['budgets']);
            } else {
              this.enableCompleteSetup = true;
              this.app.isBudgetAvailableSub.next(true);
            }
          }
        },
        (err) => {
          console.error(err);
          this.app.hideSpinner();
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

  onNameClick(name: string) {
    this.form.get('name')?.setValue(name);
  }

  onAmountClick(amount: number) {
    this.form.get('totalBudget')?.setValue(amount);
  }

  getBudget(txnId: string) {
    this.app.showSpinner();
    this.app.getBudgetById(txnId).subscribe((data) => {
      if (data) {
        this.app.hideSpinner();
        this.form.patchValue(data);
        this.isUpdate = true;
      }
    });
  }

  updateBudget() {
    if (this.form.valid) {
      this.app.showSpinner();
      this.app.update(this.budgetId, this.form.value).subscribe(
        (res) => {
          if (res) {
            this.app.hideSpinner();
            this.message.success(`Budget updated !`);
            this.router.navigate(['budgets']);
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

  closeCompSetup(){
    this.enableCompleteSetup = !this.enableCompleteSetup
  }
}

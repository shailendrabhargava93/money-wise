import { STATUS } from './../status.enum';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from './../app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component } from '@angular/core';

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

  constructor(
    private fb: FormBuilder,
    private app: AppService,
    private message: NzMessageService,
    private router: Router,
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
  }
  createBudget(): void {
    if (this.form.valid) {
      this.app.showSpinner();
      this.app.createBudget(this.form.value).subscribe(
        (res) => {
          if (res) {
            this.app.hideSpinner();
            this.message.success(`Budget created !`);
            this.router.navigate(['budgets']);
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
}

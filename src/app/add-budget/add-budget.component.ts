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
  form: FormGroup;
  userEmail$ = this.app.userEmail;
  isUpdate = false;
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
    });
  }

  ngOnInit() {
    this.userEmail$.subscribe((user) =>
      this.form.controls['createdBy'].setValue(user)
    );
  }
  createBudget(): void {
    if (this.form.valid) {
      this.app.showSpinner();
      this.app.createBudget(this.form.value).subscribe((res) => {
        if (res) {
          this.app.hideSpinner();
          this.message.success(`Budget added !`);
          this.router.navigate(['budgets']);
        }
      });
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

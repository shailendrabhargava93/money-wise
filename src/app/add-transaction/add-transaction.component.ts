import { Router } from '@angular/router';
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
  constructor(
    private fb: FormBuilder,
    private app: AppService,
    private message: NzMessageService,
    private router: Router
  ) {
    this.form = this.fb.group({
      title: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      category: [null, [Validators.required]],
      date: [null, [Validators.required]],
      user: [null],
    });
  }

  ngOnInit() {
    this.userEmail$.subscribe((user) =>
      this.form.controls['user'].setValue(user)
    );

    for (var n in CAT_ICON) {
      const icon = CAT_ICON[n as keyof typeof CAT_ICON];
      this.categories.push({ name: n, icon: `/assets/icons/${icon}.png` });
    }
    this.categories.sort((a, b) =>
      a.name > b.name ? 1 : b.name > a.name ? -1 : 0
    );
    const date = new Date();
    this.form.controls['date'].setValue(date);
  }

  submitForm(): void {
    if (this.form.valid) {
      this.app.showSpinner();
      this.app.createTransaction(this.form.value).subscribe((res) => {
        if (res) {
          this.app.hideSpinner();
          this.message.success(`Transaction added !`);
          this.router.navigate(['transactions']);
        }
      });
    }
  }
}

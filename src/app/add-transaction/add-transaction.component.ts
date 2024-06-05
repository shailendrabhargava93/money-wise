import { AppService } from './../app.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.css'],
})
export class AddTransactionComponent {
  form: FormGroup;
  options = ['Bills', 'Shopping', 'Entertainment', 'Misc'];
  userEmail$ = this.app.userEmail;
  constructor(private fb: FormBuilder, private app: AppService) {
    this.form = this.fb.group({
      title: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      category: [null, [Validators.required]],
      date: [null, [Validators.required]],
      user: [null],
    });
  }

  submitForm(): void {
    if (this.form.valid) {
      this.userEmail$.subscribe((user) =>
        this.form.controls['user'].setValue(user)
      );
      console.log('data', this.form.value);
      this.app.createTransaction(this.form.value).subscribe((res) => {
        if (res) {
          alert('success!');
        }
      });
    }
  }
}

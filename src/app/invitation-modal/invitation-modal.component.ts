import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from './../app.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  Component,
  Input,
  EventEmitter,
  Output,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-invitation-modal',
  templateUrl: './invitation-modal.component.html',
  styleUrls: ['./invitation-modal.component.css'],
})
export class InvitationModalComponent implements OnChanges {
  @Input() visible = false;
  @Input() budget!: any;

  @Input() users!: any[];
  @Output() closeModal: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;
  isConfirmLoading = false;
  currentUser!: string;

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
      notify:[false],
      budgetId: [null],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    this.app.userName.subscribe((e) => {
      this.currentUser = e as string;
    });

    if (changes && changes['budget']) {
      this.budget = changes['budget'].currentValue;
    }

    if (this.budget) {
      this.form.get('budgetId')?.setValue(this.budget.id);
    }
  }

  onClose() {
    this.visible = false;
    this.budget = null;
    this.form.reset();
    this.users = [];
    this.isConfirmLoading = false;
    this.closeModal.emit(this.visible);
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

              if (this.budget.name && form.email && form.notify) {
                this.sendEmail(
                  this.currentUser,
                  form.email,
                  form.email,
                  this.budget.name
                );
              } else {
                console.log('budget not selected or email is invalid');
              }
            }
            this.form.reset();
            this.onClose();
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

  reloadCurrentRoute() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  removeUser(email: string) {
    this.handleShare(email);
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

import { NzMessageService } from 'ng-zorro-antd/message';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AppService } from './../app.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-more',
  templateUrl: './more.component.html',
  styleUrls: ['./more.component.css'],
})
export class MoreComponent implements OnInit {
  enableCurrencyModal = false;
  currency = this.app.currency$;
  userPhoto$ = this.app.userPhoto;
  userEmail$ = this.app.userEmail;
  constructor(
    private app: AppService,
    private router: Router,
    private angularFireAuth: AngularFireAuth,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {}

  open() {
    this.enableCurrencyModal = true;
  }
  onclose() {
    this.enableCurrencyModal = false;
  }

  logout() {
    this.angularFireAuth.signOut();
    localStorage.clear();
    this.app.currentUserSubject.next(null);
    this.app.isBudgetAvailableSub.next(false);
    this.router.navigate(['login']);
    this.message.success(`Logged Out successfully !`);
  }
}

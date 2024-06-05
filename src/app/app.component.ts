import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService, User } from './app.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(
    private app: AppService,
    private router: Router,
    private message: NzMessageService
  ) {}

  tabs = [
    {
      name: 'Home',
      icon: 'home',
      link: 'home',
    },
    {
      name: 'Transactions',
      icon: 'container',
      link: 'transactions',
    },
    {
      name: 'More',
      icon: 'small-dash',
      link: 'more',
    },
  ];
  isLoggedin$ = this.app.isLoggedIn$;

  logout() {
    localStorage.clear();
    this.app.currentUserSubject.next(null);
    this.router.navigate(['login']);
    this.message.success(`Logged Out successfully !`);
  }
}

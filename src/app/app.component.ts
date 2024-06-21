import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from './app.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  isSpinning$ = this.app.isSpinning$;
  isLoggedin$ = this.app.isLoggedIn$;
  userPhoto$: any;
  constructor(
    private app: AppService,
    private router: Router,
    private message: NzMessageService
  ) {
    this.userPhoto$ = this.app.userPhoto;
  }

  logout() {
    localStorage.clear();
    this.app.currentUserSubject.next(null);
    this.router.navigate(['login']);
    this.message.success(`Logged Out successfully !`);
  }
}

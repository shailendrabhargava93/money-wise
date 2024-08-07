import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AppService } from './app.service';
import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterContentChecked {
  isSpinning$ = this.app.isSpinning$;
  isLoggedin$ = this.app.isLoggedIn$;
  userPhoto$: any;
  visible = false;
  constructor(
    private app: AppService,
    private router: Router,
    private angularFireAuth: AngularFireAuth,
    private message: NzMessageService,
    private cdref: ChangeDetectorRef
  ) {
    this.userPhoto$ = this.app.userPhoto;
    this.app.showPopup$
      .pipe(tap((value) => (this.visible = value)))
      .subscribe();
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  logout() {
    this.angularFireAuth.signOut();
    localStorage.clear();
    this.app.currentUserSubject.next(null);
    this.app.isBudgetAvailableSub.next(false);
    this.router.navigate(['login']);
    this.message.success(`Logged Out successfully !`);
  }

  close(): void {
    this.visible = false;
  }
}

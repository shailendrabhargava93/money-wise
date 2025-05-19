import { AppService } from './app.service';
import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterContentChecked {
  isSpinning$ = this.app.isSpinning$;
  isLoggedin$ = this.app.isLoggedIn$;
  visible = false;
  currentRoute!: string;
  constructor(
    private app: AppService,
    private cdref: ChangeDetectorRef,
    private router: Router
  ) {
    this.app.showPopup$
      .pipe(tap((value) => (this.visible = value)))
      .subscribe();
  }

  ngAfterContentChecked() {
    this.currentRoute = this.router.url.slice(1, this.router.url.length);
    if (this.currentRoute.includes('/')) {
      this.currentRoute = this.currentRoute.split('/')[0];
    }
    if (this.currentRoute.includes('-')) {
      this.currentRoute = this.currentRoute.replace("-", " ");
    }
    this.cdref.detectChanges();
  }

  close(): void {
    this.visible = false;
  }

  showMenu() {
    return (
      this.currentRoute &&
      this.currentRoute !== 'main' &&
      this.currentRoute !== 'login'
    );
  }
}

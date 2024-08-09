import { AppService } from './app.service';
import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { tap } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterContentChecked {
  isSpinning$ = this.app.isSpinning$;
  isLoggedin$ = this.app.isLoggedIn$;
  visible = false;
  constructor(
    private app: AppService,
    private cdref: ChangeDetectorRef
  ) {
    this.app.showPopup$
      .pipe(tap((value) => (this.visible = value)))
      .subscribe();
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  close(): void {
    this.visible = false;
  }
}

import { AppService } from './app.service';
import {
  AfterContentChecked,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  tap,
  Observable,
  Subscription,
  fromEvent,
  Subject,
  timer,
  takeUntil,
  BehaviorSubject,
} from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterContentChecked, OnInit, OnDestroy {
  isSpinning$ = this.app.isSpinning$;
  isLoggedin$ = this.app.isLoggedIn$;
  visible = false;
  currentRoute!: string;
  onlineEvent: Observable<Event> | undefined;
  offlineEvent!: Observable<Event>;
  subscriptions: Subscription[] = [];
  connectionStatus$ = new BehaviorSubject<string>(''); // Holds current status
  private destroy$ = new Subject<void>();

  constructor(
    private app: AppService,
    private cdref: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.app.showPopup$
        .pipe(tap((value) => (this.visible = value)))
        .subscribe()
    );
    // Listen for online
    const online$ = fromEvent(window, 'online').pipe(
      tap(() => {
        console.log('Online...');
        this.connectionStatus$.next('online');

        // Reset after 3 seconds
        timer(3000)
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => this.connectionStatus$.next(''));
      })
    );
    // Listen for offline
    const offline$ = fromEvent(window, 'offline').pipe(
      tap(() => {
        console.log('Offline...');
        this.destroy$.next(); // Cancel the timer
        this.connectionStatus$.next('offline');
      })
    );

    this.subscriptions.push(online$.subscribe(), offline$.subscribe());
  }

  get isInternetNotConnected(): boolean {
    return this.connectionStatus$.getValue() === 'offline';
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterContentChecked() {
    this.currentRoute = this.router.url.slice(1, this.router.url.length);
    if (this.currentRoute.includes('/')) {
      this.currentRoute = this.currentRoute.split('/')[0];
    }
    if (this.currentRoute.includes('-')) {
      this.currentRoute = this.currentRoute.replace('-', ' ');
    }
    this.cdref.detectChanges();
  }

  close(): void {
    this.visible = false;
  }

  showMenu() {
    return (
      this.currentRoute &&
      this.currentRoute !== 'login' &&
      this.currentRoute !== 'setup' &&
      this.currentRoute !== 'home'
    );
  }

  hideFooter() {
    return this.currentRoute && this.currentRoute !== 'setup';
  }
}

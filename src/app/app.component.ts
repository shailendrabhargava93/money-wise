import { AppService, User } from './app.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private app: AppService, private router: Router) {}

  isLoggedin$ = this.app.isLoggedIn$;
  title = 'money-wise';
  openTab = 1;
  toggleTabs($tabNumber: number) {
    this.openTab = $tabNumber;
  }
  logout() {
    localStorage.clear();
    this.app.currentUserSubject.next(null);
    this.router.navigate(['login']);
  }
}

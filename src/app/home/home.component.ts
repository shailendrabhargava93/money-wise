import { AppService } from './../app.service';
import { Component } from '@angular/core';
import { take, catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  username$: any;
  constructor(private app: AppService) {
    this.username$ = this.app.userName;

    this.app.userEmail
      .pipe(
        take(1),
        switchMap((user) => {
          if (user) {
            return this.app.findBudgetForUser(user).pipe(
              catchError((error) => {
                console.error('Error finding budget for user:', error);
                return of(null);
              })
            );
          } else {
            return of(null);
          }
        }),
        catchError((error) => {
          console.error('Error subscribing to user email:', error);
          return of(null);
        })
      )
      .subscribe((data) => {
        this.app.isBudgetAvailableSub.next(data as boolean);
      });
  }
}

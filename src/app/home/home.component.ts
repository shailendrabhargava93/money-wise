import { AppService } from './../app.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  username$: any;
  constructor(private app: AppService) {
    this.username$ = this.app.userName;
    this.app.userEmail.subscribe((user) => {
      if (user) {
        this.app.findBudgetForUser(user).subscribe((data) => {
          this.app.isBudgetAvailableSub.next(true);
        });
      }
    });
  }
}

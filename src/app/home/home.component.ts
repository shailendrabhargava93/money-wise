import { Router } from '@angular/router';
import { AppService } from './../app.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  username$: any;
  constructor(private app: AppService, private router: Router) {
    this.username$ = this.app.userName;
  }

  onadd() {
    this.router.navigate(['add']);
  }
}

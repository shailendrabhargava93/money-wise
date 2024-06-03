import { Router } from '@angular/router';
import { AppService } from './../app.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  constructor(private app: AppService, private router: Router) {}
  user = this.app.user;

  logout() {
    localStorage.clear();
    this.router.navigate(['login']);
  }
}

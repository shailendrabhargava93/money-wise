import { AppService, User } from './../app.service';
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { GoogleAuthProvider } from '@firebase/auth';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(
    private angularFireAuth: AngularFireAuth,
    private router: Router,
    private message: NzMessageService,
    private app: AppService
  ) {}

  login() {
    this.angularFireAuth
      .signInWithPopup(new GoogleAuthProvider())
      .then((data) => {
        this.message.success(`Loggedin successfully !`);
        const user = { name: data.user?.displayName, email: data.user?.email };
        localStorage.setItem('user', JSON.stringify(user));
        this.app.currentUserSubject.next(user as User);

        this.router.navigate(['home']);
      })
      .catch((error) => {
        console.error(error);
        this.message.success(`${error}`);
        this.router.navigate(['login']);
      });
  }
}

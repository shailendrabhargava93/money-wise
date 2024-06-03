import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { GoogleAuthProvider } from '@firebase/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(private angularFireAuth: AngularFireAuth, private router : Router) {}

  login() {
    this.angularFireAuth
      .signInWithPopup(new GoogleAuthProvider())
      .then((data) => {
        console.log(data);
        const user = {name: data.user?.displayName, email: data.user?.email}
        localStorage.setItem("user", JSON.stringify(user));
        alert("Login success!!")
        this.router.navigate(['home']);
      }).catch((error)=>{
        console.error(error);
        this.router.navigate(['login']);
      });
  }
}

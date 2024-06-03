import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private BASE_URL = 'https://budget-app-backend-ten.vercel.app/';
  constructor(private http: HttpClient) {}

  getTransactions() {
    return this.http.get(this.BASE_URL + 'getall');
  }

  get isLoggedIn(): boolean {
    const token = localStorage.getItem('user');
    const user = JSON.parse(token as string);
    return user && user.name && user.email ? true : false;
  }

  get user(){
    const token = localStorage.getItem('user');
    const user = JSON.parse(token as string);
    return user && user.name ? user.name : 'User';
  }
}

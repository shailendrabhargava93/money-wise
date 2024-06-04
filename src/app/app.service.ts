import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of } from 'rxjs';

export interface User {
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private BASE_URL = 'https://budget-app-backend-ten.vercel.app/';
  public currentUserSubject: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('user');
    const user = JSON.parse(token as string);
    this.currentUserSubject.next(user);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  getTransactions() {
    return this.http.get(this.BASE_URL + 'getall');
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.currentUser.pipe(
      map((user) => user != null && user.name != null && user.email != null)
    );
  }

  get userName(): Observable<string | undefined> {
    return this.currentUser.pipe(map((user) => user?.name));
  }

  get userEmail(): Observable<string | undefined> {
    return this.currentUser.pipe(map((user) => user?.email));
  }
}

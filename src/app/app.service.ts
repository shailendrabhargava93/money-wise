import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

export interface User {
  name: string;
  email: string;
  photo: string;
}

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private BASE_URL = 'https://budget-app-backend-ten.vercel.app/';
  //private BASE_URL = 'http://localhost:8000/';

  public currentUserSubject: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);
  public currentUser: Observable<User | null>;

  public isSpinningSub: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public isSpinning$: Observable<boolean>;

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('user');
    const user = JSON.parse(token as string);
    this.currentUserSubject.next(user);
    this.currentUser = this.currentUserSubject.asObservable();
    this.isSpinning$ = this.isSpinningSub.asObservable();
  }

  getTransactions() {
    return this.http.get(this.BASE_URL + 'txn/all');
  }

  createTransaction(data: any) {
    return this.http.post(this.BASE_URL + 'txn/create', data);
  }

  getBudgets() {
    return this.http.get(this.BASE_URL + 'budget/all');
  }

  createBudget(data: any) {
    return this.http.post(this.BASE_URL + 'budget/created', data);
  }

  share(data: any) {
    return this.http.post(this.BASE_URL + 'share', data);
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

  get userPhoto(): Observable<string | undefined> {
    return this.currentUser.pipe(map((user) => user?.photo));
  }

  showSpinner() {
    this.isSpinningSub.next(true);
  }

  hideSpinner() {
    this.isSpinningSub.next(false);
  }
}

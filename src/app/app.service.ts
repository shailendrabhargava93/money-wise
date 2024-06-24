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

  public isBudgetAvailableSub: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public isBudgetAvailableObs$: Observable<boolean>;

  public budgetValuesSub: BehaviorSubject<[]> = new BehaviorSubject<[]>([]);
  public budgetValuesObs$: Observable<[]>;

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('user');
    const isAvailable = localStorage.getItem('isBudgetAvailable');
    const budgets = localStorage.getItem('budgets');

    this.currentUserSubject.next(JSON.parse(token as string));
    this.isBudgetAvailableSub.next(JSON.parse(isAvailable as string));
    this.budgetValuesSub.next(JSON.parse(budgets as any));

    this.isSpinning$ = this.isSpinningSub.asObservable();
    this.currentUser = this.currentUserSubject.asObservable();
    this.isBudgetAvailableObs$ = this.isBudgetAvailableSub.asObservable();
    this.budgetValuesObs$ = this.budgetValuesSub.asObservable();
  }

  getTransactions(email: string) {
    return this.http.get(this.BASE_URL + `txn/all/${email}`);
  }

  createTransaction(data: any) {
    return this.http.post(this.BASE_URL + `txn/create`, data);
  }

  getBudgets(email: string) {
    return this.http.get(this.BASE_URL + `budget/all/${email}`);
  }

  createBudget(data: any) {
    return this.http.post(this.BASE_URL + `budget/create`, data);
  }

  share(id: string, userEmail: string) {
    return this.http.put(this.BASE_URL + `budget/share/${id}/${userEmail}`, {});
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

  get isBudgetAvailable(): Observable<boolean | undefined> {
    return this.isBudgetAvailableObs$.pipe(map((value) => value));
  }

  get budgetValues(): Observable<any[] | undefined> {
    return this.budgetValuesObs$.pipe(map((value) => value));
  }

  showSpinner() {
    this.isSpinningSub.next(true);
  }

  hideSpinner() {
    this.isSpinningSub.next(false);
  }
}

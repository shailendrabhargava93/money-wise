import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

export interface User {
  name: string;
  email: string;
  photo: string;
}

export interface Currency {
  name: string;
  symbol: string;
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

  public showPopupSub: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public showPopup$: Observable<boolean>;

  public currencySub: BehaviorSubject<Currency> = new BehaviorSubject<Currency>(
    {
      name: 'Indian rupee',
      symbol: '₹',
    }
  );
  public currency$: Observable<Currency>;

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('user');
    const isAvailable = localStorage.getItem('isBudgetAvailable');
    const budgets = localStorage.getItem('budgets');
    const currency = localStorage.getItem('currency');

    this.currentUserSubject.next(JSON.parse(token as string));
    this.isBudgetAvailableSub.next(JSON.parse(isAvailable as string));
    this.budgetValuesSub.next(JSON.parse(budgets as any));
    this.currencySub.next(JSON.parse(currency as any));

    this.isSpinning$ = this.isSpinningSub.asObservable();
    this.currentUser = this.currentUserSubject.asObservable();
    this.isBudgetAvailableObs$ = this.isBudgetAvailableSub.asObservable();
    this.budgetValuesObs$ = this.budgetValuesSub.asObservable();
    this.showPopup$ = this.showPopupSub.asObservable();
    this.currency$ = this.currencySub.asObservable();
  }

  getTransactions(email: string, pageNumber: number) {
    return this.http.get(this.BASE_URL + `txn/all/${email}/${pageNumber}`);
  }

  createTransaction(data: any) {
    return this.http.post(this.BASE_URL + `txn/create`, data);
  }

  updateTransaction(id: any, data: any) {
    return this.http.put(this.BASE_URL + `txn/update/${id}`, data);
  }

  getTxnById(id: string) {
    return this.http.get(this.BASE_URL + `txn/${id}`);
  }

  getBudgetById(id: string) {
    return this.http.get(this.BASE_URL + `budget/${id}`);
  }

  getBudgets(email: string) {
    return this.http.get(this.BASE_URL + `budget/all/${email}`);
  }

  createBudget(data: any) {
    return this.http.post(this.BASE_URL + `budget/create`, data);
  }

  update(id: string, data: any) {
    return this.http.put(this.BASE_URL + `budget/update/${id}`, data);
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

  get currency(): Observable<Currency | undefined> {
    return this.currency$.pipe(map((c) => c));
  }

  showSpinner() {
    this.isSpinningSub.next(true);
  }

  hideSpinner() {
    this.isSpinningSub.next(false);
  }

  getCountryWithCurrency() {
    const url =
      'https://restcountries.com/v3.1/all?fields=name,currencies,flags';
    return this.http.get(url);
  }
}

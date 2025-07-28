import { environment } from './../environments/environment';
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
  private BASE_URL = environment.apiUrl;

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

  public showPopupSub: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  public showPopup$: Observable<boolean>;

  public currencySub: BehaviorSubject<Currency> = new BehaviorSubject<Currency>(
    {
      name: '',
      symbol: '',
    }
  );
  public currency$: Observable<Currency>;
  private messageSubject = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('user');
    const isAvailable = localStorage.getItem('isBudgetAvailable');
    const currency = localStorage.getItem('currency');

    this.currentUserSubject.next(JSON.parse(token as string));
    this.isBudgetAvailableSub.next(JSON.parse(isAvailable as string));
    this.currencySub.next(
      JSON.parse(currency as any) != null
        ? JSON.parse(currency as any)
        : {
            name: 'Indian Rupee',
            symbol: '₹',
          }
    );

    this.isSpinning$ = this.isSpinningSub.asObservable();
    this.currentUser = this.currentUserSubject.asObservable();
    this.isBudgetAvailableObs$ = this.isBudgetAvailableSub.asObservable();
    this.showPopup$ = this.showPopupSub.asObservable();
    this.currency$ = this.currencySub.asObservable();
  }

  public getJSON(): Observable<any> {
    return this.http.get('./assets/category-expense-suggestions.json');
  }

  getMessage(): Observable<string> {
    return this.messageSubject.asObservable();
  }

  updateMessage(message: string) {
    this.messageSubject.next(message);
  }

  getTransactions(email: string, pageNumber: number, count?: number) {
    count = count ? count : 10;
    return this.http.get(
      this.BASE_URL + `txn/all/${email}/${pageNumber}/${count}`
    );
  }

  createTransaction(data: any) {
    return this.http.post(this.BASE_URL + `txn/create`, data);
  }

  updateTransaction(id: any, data: any) {
    return this.http.put(this.BASE_URL + `txn/update/${id}`, data);
  }

  deleteTransaction(id: any) {
    return this.http.delete(this.BASE_URL + `txn/${id}`);
  }

  getTxnById(id: string) {
    return this.http.get(this.BASE_URL + `txn/${id}`);
  }

  getSpentByUser(user: string) {
    return this.http.get(this.BASE_URL + `txn/spent/${user}`);
  }

  getBudgetById(id: string) {
    return this.http.get(this.BASE_URL + `budget/${id}`);
  }

  getBudgets(email: string, status: string) {
    return this.http.get(this.BASE_URL + `budget/all/${email}/${status}`);
  }

  getMembers(email: string) {
    return this.http.get(this.BASE_URL + `member/${email}`);
  }

  createMembers(data: any) {
    return this.http.post(this.BASE_URL + `member/create`, data);
  }

  createBudget(data: any) {
    return this.http.post(this.BASE_URL + `budget/create`, data);
  }

  update(id: any, data: any) {
    return this.http.put(this.BASE_URL + `budget/update/${id}`, data);
  }

  getStats(id: string) {
    return this.http.get(this.BASE_URL + `budget/stats/${id}`);
  }

  getFilterTxn(data: any) {
    return this.http.post(this.BASE_URL + `txn/filter`, data);
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

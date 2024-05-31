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
}

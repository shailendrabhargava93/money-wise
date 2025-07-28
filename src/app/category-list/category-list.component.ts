import { AppService } from './../app.service';
import { Component, Input, OnInit } from '@angular/core';
import { catchError, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'],
})
export class CategoryListComponent implements OnInit {
  @Input() categoryData: any[] = [];
  @Input() labelListData: any[] = [];
  currency = this.app.currency$;

  visbleTxnModal = false;
  selectedCategory!: string;
  selectedLabel!: string;
  labels: any[] = [];
  constructor(private app: AppService) { }
  ngOnInit(): void {
    this.app.userEmail
      .pipe(
        switchMap((user) => this.app.getMembers(user as string)),
        catchError((error) => {
          console.error('Error occurred getMembers:', error);
          this.app.hideSpinner();
          return of([]);
        })
      )
      .subscribe((data) => {
        this.app.hideSpinner();
        const members = data as any[];
        if (members.length > 0) {
          this.labels = members;
        } else {
          this.labels = [];
        }
      });
  }

  getLabelIcon(label: string): string {
    const foundLabel = this.labels.find((el) => el.name === label);
    return foundLabel ? foundLabel.avatar : '';
  }

  showTxnListByCat(cat: string) {
    this.visbleTxnModal = true;
    this.selectedCategory = cat;
  }

  showTxnListByLabel(label: string) {
    this.visbleTxnModal = true;
    this.selectedLabel = label;
  }
  closeTxnList() {
    this.visbleTxnModal = false;
    this.selectedLabel = '';
    this.selectedCategory = '';
  }

  getTotalAmount(): number {
    return this.labelListData.reduce((total, label) => total + label.sum, 0);
  }

  getSpentPercentage(amount: number): string {
    const total = this.getTotalAmount();
    if (total === 0) return '0';
    const percentage = (amount / total) * 100;
    return percentage.toFixed(1);
  }

  getCategoryTotalAmount(): number {
    return this.categoryData.reduce(
      (total, category) => total + category.sum,
      0
    );
  }
  getCategorySpentPercentage(amount: number): string {
    const total = this.getCategoryTotalAmount();
    if (total === 0) return '0';
    const percentage = (amount / total) * 100;
    return percentage.toFixed(1);
  }
}

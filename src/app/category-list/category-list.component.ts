import { AppService } from './../app.service';
import { Component, Input } from '@angular/core';
import { LABEL_ICON } from '../category-config';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'],
})
export class CategoryListComponent {
  @Input() categoryData: any[] = [];
  @Input() labelListData: any[] = [];
  currency = this.app.currency$;

  visbleTxnModal = false;
  selectedCategory!: string;
  selectedLabel!: string;
  constructor(private app: AppService) {}

  getLabelIcon(label: string): string {
    if (label in LABEL_ICON) {
      const icon = LABEL_ICON[label as keyof typeof LABEL_ICON];
      return `/assets/icons/${icon}.png`;
    }
    return `/assets/icons/other.png`;
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

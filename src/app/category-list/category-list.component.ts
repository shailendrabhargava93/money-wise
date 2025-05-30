import { LABEL_ICON } from './../category-icons';
import { AppService } from './../app.service';
import { Component, Input } from '@angular/core';

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
}

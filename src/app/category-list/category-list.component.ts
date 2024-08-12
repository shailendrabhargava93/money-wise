import { CAT_ICON } from './../category-icons';
import { AppService } from './../app.service';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'],
})
export class CategoryListComponent {
  @Input() categoryData!: any;
  currency = this.app.currency$;

  constructor(private app: AppService) {}
  getIcon(category: string): string {
    if (category in CAT_ICON) {
      const icon = CAT_ICON[category as keyof typeof CAT_ICON];
      return `/assets/icons/${icon}.png`;
    }
    return `/assets/icons/list.png`;
  }
}

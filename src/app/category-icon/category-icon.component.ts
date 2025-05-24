import { CAT_ICON } from './../category-icons';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-category-icon',
  templateUrl: './category-icon.component.html',
  styleUrls: ['./category-icon.component.css']
})
export class CategoryIconComponent {

  @Input() category!: string;

  get iconUrl(): string {
    if (this.category in CAT_ICON) {
      const icon = CAT_ICON[this.category as keyof typeof CAT_ICON];
      return `/assets/icons/${icon}.png`;
    }
    return `/assets/icons/other.png`;
  }
}

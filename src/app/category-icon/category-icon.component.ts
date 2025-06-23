import { Component, Input } from '@angular/core';
import { CategoryConfig, getCategoryConfig } from '../category-config';

@Component({
  selector: 'app-category-icon',
  templateUrl: './category-icon.component.html',
  styleUrls: ['./category-icon.component.css'],
})
export class CategoryIconComponent {
  @Input() category!: string;

  get categoryConfig(): CategoryConfig {
    return getCategoryConfig(this.category);
  }

  get iconUrl(): string {
    return this.categoryConfig.icon;
  }

  get bgColor(): string {
    return this.categoryConfig.bgColor;
  }

  // For backward compatibility, keep the old method name if needed elsewhere
  get dafultIcon(): string {
    return '📦';
  }
}

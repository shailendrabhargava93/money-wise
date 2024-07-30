import { AppService } from './../app.service';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent {

  @Input() categoryData!:any;
  currency = this.app.currency$;


  constructor(private app: AppService){}
}

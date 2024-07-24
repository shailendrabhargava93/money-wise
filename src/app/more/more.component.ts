import { AppService } from './../app.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-more',
  templateUrl: './more.component.html',
  styleUrls: ['./more.component.css'],
})
export class MoreComponent implements OnInit {
  enableCurrencyModal = false;
  currency = this.app.currency$;
  constructor(private app: AppService) {}

  ngOnInit(): void {}

  open() {
    this.enableCurrencyModal = true;
  }
  onclose() {
    this.enableCurrencyModal = false;
  }
}

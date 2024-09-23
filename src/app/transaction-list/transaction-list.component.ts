import { AppService } from './../app.service';
import { Router } from '@angular/router';
import { CAT_ICON } from './../category-icons';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css'],
})
export class TransactionListComponent {
  @Input() allTransactions!: any[];
  @Input() loadMore: boolean = false;
  @Input() enableEmpty: boolean = true;
  @Input() emptyMessage: string = 'You have no transactions';
  @Output() loadMoreRecords: EventEmitter<any> = new EventEmitter<any>();

  currency = this.app.currency$;

  constructor(private router: Router, private app: AppService) {}

  getIcon(category: string): string {
    if (category in CAT_ICON) {
      const icon = CAT_ICON[category as keyof typeof CAT_ICON];
      return `/assets/icons/${icon}.png`;
    }
    return `/assets/icons/list.png`;
  }

  onTxn(txnId: string) {
    this.router.navigate(['edit', txnId]);
  }

  onLoadMore() {
    this.loadMoreRecords.emit();
  }
}

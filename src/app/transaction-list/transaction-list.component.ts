import { AppService } from './../app.service';
import { Router } from '@angular/router';
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
  @Input() padded: boolean = true;
  @Input() emptyMessage: string = 'You have no transactions';
  @Output() loadMoreRecords: EventEmitter<any> = new EventEmitter<any>();

  currency = this.app.currency$;

  constructor(private router: Router, private app: AppService) {}

  onTxn(txnId: string) {
    this.router.navigate(['edit-transaction', txnId]);
  }

  onLoadMore() {
    this.loadMoreRecords.emit();
  }
}

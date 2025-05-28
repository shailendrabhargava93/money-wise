import { AppService } from './../app.service';
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

  visibleDetails = false;
  selectedTxnId!: string;
  currency = this.app.currency$;

  constructor(private app: AppService) {}

  openDetails(txnId: string) {
    this.selectedTxnId = txnId;
    this.visibleDetails = true;
  }

  onLoadMore() {
    this.loadMoreRecords.emit();
  }

  closeDetails() {
    this.visibleDetails = false;
  }


}

import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { AppService } from './../app.service';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-txn-details',
  templateUrl: './txn-details.component.html',
  styleUrls: ['./txn-details.component.css'],
})
export class TxnDetailsComponent implements OnInit {
  @Input() visibleDetails: boolean = false;
  @Input() txnId!: string;
  @Output() closed :EventEmitter<any> = new EventEmitter<any>();
  currency!: string | undefined;
  txnData!: any;
  constructor(
    private router: Router,
    private app: AppService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    if (this.txnId != null) {
      this.app.getTxnById(this.txnId).subscribe((data) => {
        if (data) {
          this.app.hideSpinner();
          this.visibleDetails = true;
          this.txnData = data;
        }
      });
    }
  }

  closeFilters(): void {
    this.visibleDetails = false;
    this.closed.emit();
  }

  edit(txnId: string) {
    this.router.navigate(['edit-transaction', txnId]);
  }

  deleteTxn(txnId: string) {
    this.app.showSpinner();
    this.app.deleteTransaction(txnId).subscribe(
      (res) => {
        if (res) {
          this.app.hideSpinner();
          this.message.success(`Transaction Deleted !`);
          this.router.navigate(['transactions']);
          this.closed.emit();
        }
      },
      (err) => {
        this.app.hideSpinner();
        console.error(err);
        this.message.error(`An error occurred: ${err.message}`);
      }
    );
  }
}

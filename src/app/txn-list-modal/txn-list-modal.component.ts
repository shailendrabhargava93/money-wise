import { AppService } from './../app.service';
import { Subscription } from 'rxjs';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-txn-list-modal',
  templateUrl: './txn-list-modal.component.html',
  styleUrls: ['./txn-list-modal.component.css'],
})
export class TxnListModalComponent implements OnDestroy {
  @Input() visible!: boolean;
  @Input() category!: string;
  @Input() label!: string;
  @Output() closeModal = new EventEmitter();
  private subscriptions: Subscription[] = [];

  constructor(private app: AppService) {}

  transactions: any[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['category'] || changes['label']) {
      this.loadTransactions();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  loadTransactions() {
    if (this.category) {
      // Load transactions by category
      this.getTransactions(this.category, null);
    } else if (this.label) {
      // Load transactions by label
      this.getTransactions(null, this.label);
    }
  }

  getTransactions(category: any, label: any) {
    let email;
    const subscription = this.app.userEmail.subscribe((m) => (email = m));
    const data = {
      email: email,
      categories: category ? [category] : null,
      labels: label ? [label] : null,
    };
    const subscriptionfilter = this.app.getFilterTxn(data).subscribe((data) => {
      this.transactions = data as any[];
    });
    this.subscriptions.push(subscription, subscriptionfilter);
  }

  close() {
    this.closeModal.emit();
  }
}

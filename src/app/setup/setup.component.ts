
import {
  Component
} from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
})
export class SetupComponent {
  enableCurrencyModal = false;
  enableMemberModal = false;
  enableAddBudget = false
  currency = this.app.currency$;
  constructor(private app: AppService) {}

  toggleCurrencyModal() {
    this.enableCurrencyModal = !this.enableCurrencyModal;
  }

  toggleMemModal() {
    this.enableMemberModal = !this.enableMemberModal;
  }

  isStart = true;
  isCurrency = false;
  isMember = false;
  isBudget = false;

  start() {
    this.isStart = false;
    this.isCurrency = true;
  }

  goBackToStart() {
    this.isStart = true;
    this.isCurrency = false;
    this.isMember = false;
    this.isBudget = false;
  }

  moveToMembers() {
    this.isCurrency = false;
    this.isMember = true;
  }

  goBackToCurrency() {
    this.isCurrency = true;
    this.isMember = false;
  }

  moveToBudget() {
    this.isBudget = true;
    this.isMember = false;
  }

  goBackToMembers() {
    this.isBudget = false;
    this.isMember = true;
  }

  toggleBudgetModal() {
    this.isBudget = false;
    this.enableAddBudget = !this.enableAddBudget;
  }

}
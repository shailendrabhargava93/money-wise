import { AppService } from './../app.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-currency-modal',
  templateUrl: './currency-modal.component.html',
  styleUrls: ['./currency-modal.component.css'],
})
export class CurrencyModalComponent {
  @Input() visible: boolean = false;
  @Output() closeModal: EventEmitter<any> = new EventEmitter<any>();

  selectedCurrency!: string;
  searchCountry!: string;
  globalCurrencyData: any[] = [];
  currencyData: any[] = [];

  constructor(private app: AppService) {}

  ngOnInit() {
    this.app.currency.subscribe(
      (c) => (this.selectedCurrency = c?.name as string)
    );
    this.app.getCountryWithCurrency().subscribe((data: any) => {
      if (data) {
        data = data.sort((a: any, b: any) => {
          return a.name.common.toLowerCase() > b.name.common.toLowerCase()
            ? 1
            : -1;
        });
        this.currencyData = this.extractInfo(data);
        this.globalCurrencyData = this.currencyData;
      }
    });
  }

  extractInfo(data: any[]): any[] {
    let modifiedObjects: any[] = [];

    for (let obj of data) {
      if (Object.keys(obj.currencies).length > 0) {
        let name = obj.name.common;
        let currencyCode = Object.keys(obj.currencies)[0];
        let currencyName = obj.currencies[currencyCode].name;
        let currencySymbol = obj.currencies[currencyCode].symbol;
        let flag = obj.flags.svg;

        let newObject = {
          name: name,
          currency: currencyName,
          symbol: currencySymbol,
          flag: flag,
        };
        modifiedObjects.push(newObject);
      }
    }
    return modifiedObjects;
  }

  update() {
    console.log(this.selectedCurrency);
    const obj = this.currencyData.find(
      (c) => c.currency == this.selectedCurrency
    );
    console.log(obj);
    const updated = { name: obj.currency, symbol: obj.symbol };
    localStorage.setItem('currency', JSON.stringify(updated));
    this.app.currencySub.next(updated);
  }

  search() {
    if (this.searchCountry && this.searchCountry.length > 1) {
      this.currencyData = this.currencyData.filter((c) =>
        c.name.toLowerCase().includes(this.searchCountry.toLowerCase())
      );
    } else {
      this.currencyData = this.globalCurrencyData;
    }
  }

  close() {
    this.visible = false;
    this.closeModal.emit(this.visible);
  }
}

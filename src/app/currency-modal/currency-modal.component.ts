import { AppService } from './../app.service';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-currency-modal',
  templateUrl: './currency-modal.component.html',
  styleUrls: ['./currency-modal.component.css'],
})
export class CurrencyModalComponent implements OnInit {
  private _visible: boolean = false;

  @Input()
  set visible(value: boolean) {
    this._visible = value;
    // Load data only when modal becomes visible and data hasn't been loaded yet
    if (value && !this.dataLoaded) {
      this.loadCurrencyData();
    }
  }

  get visible(): boolean {
    return this._visible;
  }

  @Output() closeModal: EventEmitter<any> = new EventEmitter<any>();

  selectedCurrency!: string;
  searchCurrency!: string;
  globalCurrencyData: any[] = [];
  currencyData: any[] = [];
  private dataLoaded: boolean = false;

  constructor(private app: AppService) {}

  ngOnInit() {
    // Only subscribe to currency changes
    this.app.currency.subscribe(
      (c) => (this.selectedCurrency = c?.name as string)
    );
  }

  private loadCurrencyData() {
    this.app.getCountryWithCurrency().subscribe((data: any) => {
      if (data) {
        data = data.sort((a: any, b: any) => {
          return a.name.common.toLowerCase() > b.name.common.toLowerCase()
            ? 1
            : -1;
        });
        this.currencyData = this.extractInfo(data);
        this.globalCurrencyData = this.currencyData;
        this.dataLoaded = true;
      }
    });
  }

  extractInfo(data: any[]): any[] {
    let modifiedObjects: any[] = [];

    for (let obj of data) {
      if (Object.keys(obj.currencies).length > 0) {
        let currencyCode = Object.keys(obj.currencies)[0];
        let currencyName = obj.currencies[currencyCode].name;
        let currencySymbol = obj.currencies[currencyCode].symbol;
        let flag = obj.flags.svg;

        let newObject = {
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
    const obj = this.currencyData.find(
      (c) => c.currency == this.selectedCurrency
    );
    const updated = { name: obj.currency, symbol: obj.symbol };
    localStorage.setItem('currency', JSON.stringify(updated));
    this.app.currencySub.next(updated);
    this.close();
  }

  search() {
    if (this.searchCurrency && this.searchCurrency.length > 1) {
      this.currencyData = this.currencyData.filter((c) =>
        c.currency.toLowerCase().includes(this.searchCurrency.toLowerCase())
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

import { AppService, Currency } from './../app.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-more',
  templateUrl: './more.component.html',
  styleUrls: ['./more.component.css'],
})
export class MoreComponent implements OnInit {
  visibleCurrency = false;
  globalCountryData: any[] = [];
  countryData: any[] = [];
  selectedCurrency!: Currency;
  searchCountry!: string;
  constructor(private app: AppService) {}

  ngOnInit(): void {
    this.app.currency$.subscribe((c) => (this.selectedCurrency = c));
  }

  open() {
    this.app.getCountryWithCurrency().subscribe((data: any) => {
      if (data) {
        data = data.sort((a: any, b: any) => {
          return a.name.common.toLowerCase() > b.name.common.toLowerCase()
            ? 1
            : -1;
        });
        this.countryData = this.extractInfo(data);
        this.globalCountryData = this.countryData;
      }
    });
    this.visibleCurrency = true;
  }
  close() {
    this.visibleCurrency = false;
  }

  extractInfo(data: any[]): any[] {
    let modifiedObjects: any[] = [];

    for (let obj of data) {
      if (Object.keys(obj.currencies).length > 0) {
        let name = obj.name.common;
        let currencyCode = Object.keys(obj.currencies)[0];
        let currencyName = obj.currencies[currencyCode].name;
        let currencySymbol = obj.currencies[currencyCode].symbol;
        let flag = obj.flags.png;

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
    localStorage.setItem('currency', JSON.stringify(this.selectedCurrency));
    this.app.currencySub.next(this.selectedCurrency);
  }

  search() {
    if (this.searchCountry && this.searchCountry.length > 1) {
      this.countryData = this.countryData.filter((c) =>
        c.name.toLowerCase().includes(this.searchCountry.toLowerCase())
      );
    } else {
      this.countryData = this.globalCountryData;
    }
  }
}

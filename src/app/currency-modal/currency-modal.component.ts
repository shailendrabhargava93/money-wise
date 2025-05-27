import { AppService } from './../app.service';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

interface Currency {
  currency: string;
  symbol: string;
  flag: string;
  name?: string;
}

@Component({
  selector: 'app-currency-modal',
  templateUrl: './currency-modal.component.html',
  styleUrls: ['./currency-modal.component.css'],
})
export class CurrencyModalComponent implements OnInit, OnDestroy {
  private _visible: boolean = false;
  private dataLoaded: boolean = false;
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

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
  searchCurrency: string = '';
  globalCurrencyData: Currency[] = [];
  currencyData: Currency[] = [];
  filteredCurrencies: Currency[] = [];

  constructor(private app: AppService) {}

  ngOnInit() {
    // Subscribe to currency changes
    this.app.currency.subscribe(
      (c) => (this.selectedCurrency = c?.name as string)
    );

    // Setup debounced search
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((searchTerm) => {
        this.performSearch(searchTerm);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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
        this.globalCurrencyData = [...this.currencyData];
        this.filteredCurrencies = [...this.currencyData];
        this.dataLoaded = true;
      }
    });
  }

  extractInfo(data: any[]): Currency[] {
    let modifiedObjects: Currency[] = [];

    for (let obj of data) {
      if (Object.keys(obj.currencies).length > 0) {
        let currencyCode = Object.keys(obj.currencies)[0];
        let currencyName = obj.currencies[currencyCode].name;
        let currencySymbol = obj.currencies[currencyCode].symbol;
        let flag = obj.flags.svg;

        let newObject: Currency = {
          currency: currencyName,
          symbol: currencySymbol,
          flag: flag,
        };
        modifiedObjects.push(newObject);
      }
    }
    return modifiedObjects;
  }

  onSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchCurrency = target.value;
    this.searchSubject.next(this.searchCurrency);
  }

  search() {
    this.performSearch(this.searchCurrency);
  }

  private performSearch(searchTerm: string) {
    if (!searchTerm || searchTerm.trim() === '') {
      this.filteredCurrencies = [...this.globalCurrencyData];
      return;
    }

    const term = searchTerm.toLowerCase().trim();
    this.filteredCurrencies = this.globalCurrencyData.filter(
      (currency) =>
        currency.currency.toLowerCase().includes(term) ||
        currency.symbol.toLowerCase().includes(term)
    );
  }

  clearSearch(): void {
    this.searchCurrency = '';
    this.filteredCurrencies = [...this.globalCurrencyData];
    this.searchSubject.next('');
  }

  update() {
    const obj = this.filteredCurrencies.find(
      (c) => c.currency == this.selectedCurrency
    );
    if (obj) {
      const updated = { name: obj.currency, symbol: obj.symbol };
      localStorage.setItem('currency', JSON.stringify(updated));
      this.app.currencySub.next(updated);
    }
    this.close();
  }

  close() {
    this._visible = false;
    this.closeModal.emit(this._visible);
  }

  trackByCurrency(index: number, currency: Currency): string {
    return currency.currency;
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    // Set a fallback image or hide the image
    img.style.display = 'none';
  }
}

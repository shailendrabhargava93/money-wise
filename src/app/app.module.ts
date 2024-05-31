import { HttpClientModule } from '@angular/common/http';
import { NgZorroAntdModule } from './ng-zorro-antd.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { StatsComponent } from './stats/stats.component';

@NgModule({
  declarations: [AppComponent, TransactionsComponent, StatsComponent],
  imports: [BrowserModule, AppRoutingModule, NgZorroAntdModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

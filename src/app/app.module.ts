import { environment } from './../environments/environment.development';
import { HttpClientModule } from '@angular/common/http';
import { NgZorroAntdModule } from './ng-zorro-antd.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { StatsComponent } from './stats/stats.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AddTransactionComponent } from './add-transaction/add-transaction.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import en from '@angular/common/locales/en';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { registerLocaleData } from '@angular/common';
import { MoreComponent } from './more/more.component';
import { BudgetsComponent } from './budgets/budgets.component';
import { MainCarouselComponent } from './main-carousel/main-carousel.component';
import { AddBudgetComponent } from './add-budget/add-budget.component';
import { NgChartsModule } from 'ng2-charts';
import { BudgetOverviewComponent } from './budget-overview/budget-overview.component';
import { CurrencyModalComponent } from './currency-modal/currency-modal.component';
import { InvitationModalComponent } from './invitation-modal/invitation-modal.component';
import { WarningModalComponent } from './warning-modal/warning-modal.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { CompleteBudgetComponent } from './complete-budget/complete-budget.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';

registerLocaleData(en);

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(
  (key) => antDesignIcons[key]
);

@NgModule({
  declarations: [
    AppComponent,
    TransactionsComponent,
    StatsComponent,
    LoginComponent,
    HomeComponent,
    AddTransactionComponent,
    MoreComponent,
    BudgetsComponent,
    MainCarouselComponent,
    AddBudgetComponent,
    BudgetOverviewComponent,
    CurrencyModalComponent,
    InvitationModalComponent,
    WarningModalComponent,
    CategoryListComponent,
    TransactionListComponent,
    CompleteBudgetComponent,
    ConfirmModalComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgZorroAntdModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    NgChartsModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    { provide: NZ_ICONS, useValue: icons },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './dashboard/header/header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { UsersComponent } from './components/users/users.component';
import { CoinsComponent } from './components/coins/coins.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { HttpClientModule } from '@angular/common/http';
import { PumpComponent } from './components/newCoins/pump/pump.component';
import { MatMenuModule } from '@angular/material/menu';
import { DextoolsComponent } from './components/newCoins/dextools/dextools.component';
import { IcoComponent } from './components/newCoins/ico/ico.component';
import { RaydiumComponent } from './components/raydium/raydium.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    UsersComponent,
    CoinsComponent,
    PortfolioComponent,
    TransactionsComponent,
    PumpComponent,
    DextoolsComponent,
    IcoComponent,
    RaydiumComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    HttpClientModule,
    MatMenuModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

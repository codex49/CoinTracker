import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './components/users/users.component';
import { CoinsComponent } from './components/coins/coins.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { PumpComponent } from './components/newCoins/pump/pump.component';
import { DextoolsComponent } from './components/newCoins/dextools/dextools.component';
import { RaydiumComponent } from './components/raydium/raydium.component';

const routes: Routes = [
  {
    path: 'new/dextools',
    component: DextoolsComponent
  },
  {
    path: 'new/raydium',
    component: RaydiumComponent
  },
  {
    path: 'users',
    component: UsersComponent
  },
  {
    path: 'coins',
    component: CoinsComponent
  },
  {
    path: 'portfolio',
    component: PortfolioComponent
  },
  {
    path: 'transactions',
    component: TransactionsComponent
  },
  {
    path: 'pump/:exchange/:ratio',
    component: PumpComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

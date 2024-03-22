import { Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NewCoinsService } from 'src/app/services/newCoins.service';
import { WebSocketService } from 'src/app/services/web-socket.service';

@Component({
  selector: 'app-dextools',
  templateUrl: './dextools.component.html',
  styleUrls: ['./dextools.component.css']
})
export class DextoolsComponent {
  displayedColumns: string[] = ['name', 'market_cap', 'liquidity', 'holders', 'website', 'twitter'];
  dataSource = new MatTableDataSource<any>();
  coinURL: string = 'https://dexscreener.com/solana';
  coinsNumber: number = 0;

  @ViewChild(MatSort, {static: true}) sort!: MatSort;
  
  constructor(private newCoinsService: NewCoinsService) {}

  ngOnInit(): void {
    this.newCoinsService.scrapNewCoins().subscribe((data)=> {})
  }

  getCoins() {
    this.newCoinsService.getNewCoins().subscribe((data)=> {
      this.dataSource.data = data;
      this.coinsNumber = data.length;
      this.setupSortingAccessor();
      this.dataSource.sort = this.sort;
    })
  }

  clearCoins() {
    this.newCoinsService.clearCoins().subscribe()
  }

  setupSortingAccessor(): void {
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'name': return item?.name;
        case 'market_cap': return item?.market_cap;
        case 'liquidity': return item?.liquidity;
        case 'holders': return item?.holders;
        default: return item[property];
      }
    };
  }
}

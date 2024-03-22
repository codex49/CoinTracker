import { Component, ViewChild, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PumpService } from 'src/app/services/pump.service';
import { interval, Subscription } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pump',
  templateUrl: './pump.component.html',
  styleUrls: ['./pump.component.css']
})
export class PumpComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['Coins', '1min', '2min', 'Time', 'Binance'];
  dataSource = new MatTableDataSource<any>();
  private subscription: Subscription = new Subscription();
  exchangeURL: string = 'https://www.kucoin.com/trade/';
  exchange: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private pumpService: PumpService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const ratio = params['ratio'];
      this.exchange = params['exchange'];

      if (this.exchange == 'binance') {
        this.exchangeURL = 'https://www.binance.com/en/trade/';
      }

      this.pumpService.startWatchingCoins(this.exchange, ratio).subscribe();
      this.setupDataRefresh();
    })
  }

  setupDataRefresh(): void {
    this.subscription.add(
      interval(6000)
        .pipe(
          startWith(0),
          switchMap(() => this.pumpService.loadPumpedCoins(this.exchange))
        )
        .subscribe(
          data => {
            this.dataSource.data = data;
            this.setupSortingAccessor();
          },
          error => console.error('Error fetching data: ', error)
        )
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  setupSortingAccessor(): void {
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'Coins': return item?.coin;
        case '1min': return parseFloat(item?.['1']);
        case '2min': return parseFloat(item?.['2']);
        case 'Time': return item?.timestamp ? new Date(item.timestamp) : null;
        default: return item[property];
      }
    };
  }

  resetPumpedCoins() {
    this.pumpService.removePumpedCoins(this.exchange).subscribe()
  }
}

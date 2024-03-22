import { Component } from '@angular/core';
import { NewCoinsService } from 'src/app/services/newCoins.service';

@Component({
  selector: 'app-raydium',
  templateUrl: './raydium.component.html',
  styleUrls: ['./raydium.component.css']
})
export class RaydiumComponent {
  tokens: any[] = [];
  constructor(private newCoinsService: NewCoinsService) {}

  ngOnInit(): void {
    this.newCoinsService.getNewRaydiumCoins().subscribe((data)=> console.log('data', data))

    this.newCoinsService.trackNewRaydiumCoins().subscribe((data) => {
      console.log('Token data received:', data);
      if (!this.tokens.includes(data)) {
        this.tokens.push(data);
      }
    });
  }
}

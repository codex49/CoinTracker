import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewCoinsService {
  private newRaydiumCoinsSubject = new Subject<any>();
  private ws: WebSocket | undefined;
  
  constructor(private http: HttpClient) {
    this.connect();
  }

  private connect(): void {
    this.ws = new WebSocket('ws://localhost:8081');

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.newRaydiumCoinsSubject.next(data);
    };

    this.ws.onerror = (event) => {
      console.error('WebSocket error:', event);
    };

    this.ws.onopen = () => {
      console.log('WebSocket connection established');
    };
  }
  
  scrapNewCoins(): Observable<any> {
    const apiUrl = 'http://localhost:3000/api/newCoins/dextools';
    return this.http.get(apiUrl);
  }
  
  clearCoins(): Observable<any> {
    const apiUrl = 'http://localhost:3000/api/newCoins/clearDextoolsCoins';
    return this.http.get(apiUrl);
  }
  
  getNewCoins(): Observable<any> {
    const apiUrl = 'http://localhost:3000/api/newCoins/getDextoolsCoins';
    return this.http.get(apiUrl);
  }
  
  getNewRaydiumCoins(): Observable<any> {
    const apiUrl = 'http://localhost:3000/api/newCoins/raydium';
    return this.http.get(apiUrl);
  }
  
  trackNewRaydiumCoins(): Observable<any> {
    return this.newRaydiumCoinsSubject.asObservable();
  }
}

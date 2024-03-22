import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PumpService {
  apiUrl = "http://localhost:3000/api/pump";

  constructor(private http: HttpClient) {}

  loadPumpedCoins(exchange: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pumpedCoins/${exchange}`);
  }

  startWatchingCoins(exchange: string, ratio: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/watch/${exchange}/${ratio}`);
  }

  removePumpedCoins(exchange: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/removePumpedCoins/${exchange}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoinsService {
  constructor(private http: HttpClient) {}
  
  getCoins(): Observable<any> {
    const apiUrl = 'http://localhost:3000/api/coins';
    return this.http.get(apiUrl);
  }
}

import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CoinTracker';

  constructor(private http: HttpClient) {}

  getTweets(): Observable<any> {
    const userId = 'veloprotocol';
    return this.http.get(`https://api.twitter.com/2/users/${userId}/tweets`);
  }

  OnInit() {

  }
}

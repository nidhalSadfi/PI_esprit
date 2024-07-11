import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GasService {
  constructor(private http: HttpClient) { }

  getGasData(): Observable<any> {
    return this.http.get('http://localhost:5000/api/gas-data');
  }
}

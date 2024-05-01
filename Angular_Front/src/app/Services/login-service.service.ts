import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {
  private apiBaseUrl = 'http://127.0.0.1:5000/api';  // Base URL for API endpoints

  constructor(private httpclient: HttpClient) { }

  private options = {
    headers: new HttpHeaders().set('Content-Type', 'application/json')
  };

  // Method to handle user login
  logging_in(User): Observable<any> {
    return this.httpclient.post<any>(`${this.apiBaseUrl}/login`, User, this.options)
      .pipe(tap(res => {
        console.log(res);
        if (res && res.user) {
          localStorage.setItem('role', res.user.role);
        }
      }));
  }

  // Method to handle user signup
  SigningUp(User): Observable<any> {
    return this.httpclient.post<any>(`${this.apiBaseUrl}/signup`, User, this.options);
  }

  // Utility method to check if the current user is an admin
  isAdmin(): boolean {
    const role = localStorage.getItem('role');
    return role === 'admin';
  }

  // Method to handle user logout
  logout(): void {
    localStorage.removeItem('role');   // Remove the stored role
    // Additional logout actions can be added here, like redirecting the user
  }
}

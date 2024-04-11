import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Register } from '../models/register.interface';
import { environment } from 'src/environments/environment.development';
import { AuthData } from '../models/auth-data.interface';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiURL = environment.apiURL;

  private authSub = new BehaviorSubject<AuthData | null>(null);
  user$ = this.authSub.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  signUp(data: Register) {
    return this.http
      .post(`${this.apiURL}register`, data)
      .pipe(catchError(this.errors));
  }

  login(data: { email: string; password: string }) {
    return this.http.post<AuthData>(`${this.apiURL}login`, data).pipe(
      tap((data) => {
        console.log('Auth data: ', data);
      }),
      tap((data) => {
        this.authSub.next(data);
        localStorage.setItem('user', JSON.stringify(data));
      }),
      catchError(this.errors)
    );
  }

  private errors(err: any) {
    switch (err.error) {
      case 'Email already exists':
        return throwError('User already exists');
        break;

      case 'Bad credentials':
        return throwError('Incorrect username or password');
        break;

      default:
        return throwError('Error');
        break;
    }
  }

  logout() {
    this.authSub.next(null);
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  restore() {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      return;
    }
    const user: AuthData = JSON.parse(userJson);
    this.authSub.next(user);
  }

  getCurrentUserId(): number | null {
    const userJson = localStorage.getItem('user');
    console.log('User JSON from localStorage:', userJson);

    if (userJson) {
      const user = JSON.parse(userJson);
      console.log('User ID from parsed JSON:', user.user.id);
      return user.user.id;
    }
    return null;
  }
}

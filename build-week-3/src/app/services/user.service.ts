import { Injectable } from '@angular/core';
import { User } from '../models/user.interface';
import { environment } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl = environment.apiURL;

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<User[]>(`${this.apiUrl}utenti`);
  }

  getUser(id:number) {
    return this.http.get<User>(`${this.apiUrl}utenti/${id}`);
  }
}

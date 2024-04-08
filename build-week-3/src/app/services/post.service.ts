import { Injectable } from '@angular/core';
import { Post } from '../models/post.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class PostService {

  apiUrl = environment.apiURL;

  constructor(private http:HttpClient) {}

  getPosts() {
    return this.http.get<Post[]>(`${this.apiUrl}posts`);
  }

  getPost(id:number) {
    return this.http.get<Post>(`${this.apiUrl}posts/${id}`);
  }

  newPost(data: Post) {
    return this.http.post<Post>(`${this.apiUrl}posts`, data);
  }

  updatePost(id:number, data: Partial<Post>) {
    return this.http.patch<Post>(`${this.apiUrl}posts/${id}`, data);
  }

  deletePost(id: number) {
    return this.http.delete<Post>(`${this.apiUrl}posts/${id}`);
  }
}

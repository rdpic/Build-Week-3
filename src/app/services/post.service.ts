import { Injectable } from '@angular/core';
import { Post } from '../models/post.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import { Favorite } from '../models/favorite.interface';

@Injectable({
    providedIn: 'root',
})
export class PostService {
    apiUrl = environment.apiURL;

    constructor(private http: HttpClient) {}

    getPosts() {
        return this.http.get<Post[]>(`${this.apiUrl}posts`);
    }

    getPost(id: number) {
        return this.http.get<Post>(`${this.apiUrl}posts/${id}`);
    }

    newPost(data: Post) {
        data.createdAt = new Date();
        return this.http.post<Post>(`${this.apiUrl}posts`, data);
    }

    getPostsByUserId(userId: number): Observable<Post[]> {
        return this.http.get<Post[]>(`${this.apiUrl}posts?userId=${userId}`);
    }

    updatePost(id: number, post: Partial<Post>): Observable<Post> {
        return this.http.put<Post>(`${this.apiUrl}posts/${id}`, post);
    }

    deletePost(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}posts/${id}`);
    }

    //-------
    addFavorite(userId: number, postId: number): Observable<Favorite> {
        const url = `${this.apiUrl}favorites`;
        return this.http.post<Favorite>(url, { userId, postId });
    }

    removeFavorite(favoriteId: number): Observable<any> {
        const url = `${this.apiUrl}favorites/${favoriteId}`;
        return this.http.delete(url);
    }

    getAllFavorites(userId: number): Observable<Favorite[]> {
        const url = `${this.apiUrl}favorites?userId=${userId}`;
        return this.http.get<Favorite[]>(url);
    }
}

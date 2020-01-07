import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from './_models/post';
import {Category} from './_models/category';

const currentUser = JSON.parse(localStorage.getItem('currentUser'));

const httpOptions = {
  headers: new HttpHeaders({
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    Authorization: 'Bearer ' + (currentUser ? currentUser.access_token : ''),
  })
};

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(
    private http: HttpClient
  ) {}

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl + '/posts', httpOptions);
  }

  addPost(post: Post, postUUID: string): Observable<Post> {
    return this.http.post<Post>(this.apiUrl + '/posts/' + postUUID, post, httpOptions);
  }

  deletePost(id: string): any {
    return this.http.delete(this.apiUrl + '/posts/' + id, httpOptions);
  }

  addComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(this.apiUrl + '/submit', comment, httpOptions);
  }

  editComment(id: number, comment: Comment): Observable<Post> {
    return this.http.put<Post>(this.apiUrl + '/comment/' + id, comment, httpOptions);
  }

  deleteComment(id: string): any {
    return this.http.delete(this.apiUrl + '/comment/' + id);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl + '/topics', httpOptions);
  }

  getFilteredPosts(categorySlug: string): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl + '/posts/topic/' + categorySlug, httpOptions);
  }

  me(): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/auth/me`, {}, httpOptions);
  }

}

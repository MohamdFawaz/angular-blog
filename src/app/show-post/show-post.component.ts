import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../api-service.service';
import { Post } from '../_models/post';
import {Category} from '../_models/category';

import Echo from 'laravel-echo';
declare var require: any;

@Component({
  selector: 'app-show-post',
  templateUrl: './show-post.component.html',
  styleUrls: ['./show-post.component.css']
})
export class ShowPostComponent implements OnInit {
  posts: Post[];
  categories: Category[];
  postIndex: number;
  data = {
    postId: '',
    body: '',
    title: '',
    postIndex: 0,
    commentId: 0,
    commentText: '',
    commentIndex: 0
  };

  display1 = 'none';
  display2 = 'none';
  constructor(
    private apiService: ApiServiceService
  ) { }

  ngOnInit() {
    this.apiService.getPosts().subscribe(
      posts => this.posts = posts
    );
    this.apiService.getCategories().subscribe(
      categories => this.categories = categories
    );

    window.io = require('socket.io-client');


    window.Echo = new Echo({
      broadcaster: 'socket.io',
      host: 'http://localhost:6001',
    });

    window.Echo.channel('laravel_database_comment')
      .listen('.App\\Events\\PostComment', (response) => {
        console.log(response);
        this.getPostIndexByID(response.data.post_id);
        this.posts[this.postIndex].comments.push(response.data);

      });
  }
  onClose() {
    this.display1 = 'none';
    this.display2 = 'none';
  }

  addPost(body: string): void {
    body = body.trim();
    this.apiService.addPost({ body } as Post)
      .subscribe(post => {
        post.comments = [];
        this.posts.push(post);
      });
  }

  editPost(id: string , body: string , index: number): void {
    body = body.trim();
    this.apiService.editPost(id , { body } as Post)
      .subscribe(isEdit => {
        if (isEdit) { this.posts[index].body = body; }
      });
  }

  deletePost(postIndex: number , id: string): void {
    this.apiService.deletePost(id).subscribe(isDelete => {
      if (isDelete) {
        // tslint:disable-next-line:triple-equals
        if (this.posts.length == 1) { this.posts = []; } else { this.posts.splice(postIndex, 1); }
      }
    });
  }

  addComment(commentText: string , postId: string , i: number): void {
    commentText = commentText.trim();
    this.apiService.addComment({body: commentText, post_id: postId} as unknown as Comment)
      .subscribe(comment => {
        this.posts[i].comments.push(comment);
      });
  }

  editComment(id: number , commentText: string , postId: string , commentIndex: number , postIndex: number): void {
    commentText = commentText.trim();
    this.apiService.editComment(id , {commentText, postId} as unknown as Comment)
      .subscribe(isEdit => {
        if (isEdit) { this.posts[postIndex].comments[commentIndex].commentText = commentText; }
      });
  }

  deleteComment(postIndex: number , commentIndex: number , id: string): void {
    this.apiService.deleteComment(id).subscribe(isDelete => {
      if (isDelete) {
        // tslint:disable-next-line:triple-equals
        if (this.posts[postIndex].comments.length == 1) {
          this.posts[postIndex].comments = [];
        } else {
          this.posts[postIndex].comments.splice(commentIndex, 1);
        }
      }
    });
  }

  getPostIndexByID(postID: string) {
    this.postIndex =  this.posts.findIndex(x => x.id === postID);
  }
  filterPosts(categorySlug: string): void {
    this.apiService.getFilteredPosts(categorySlug).subscribe(posts => this.posts = posts);
  }

}

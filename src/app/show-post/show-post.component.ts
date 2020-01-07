import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../api-service.service';
import * as uuid from 'uuid';
import Echo from 'laravel-echo';

import { Post } from '../_models/post';
import {Category} from '../_models/category';

import {AuthenticationService} from '../_services/AuthenticationService';
declare var require: any;
const postUUID = uuid.v4();

@Component({
  selector: 'app-show-post',
  templateUrl: './show-post.component.html',
  styleUrls: ['./show-post.component.css']
})
export class ShowPostComponent implements OnInit {
  posts: Post[];
  categories: Category[];
  postIndex: number;
  isUserAdmin: false;

  data = {
    postId: '',
    body: '',
    title: '',
    postIndex: 0,
    commentId: 0,
    commentText: '',
    commentIndex: 0
  };

  constructor(
    private apiService: ApiServiceService,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.apiService.getPosts().subscribe(
      posts => this.posts = posts
    );
    this.apiService.getCategories().subscribe(
      categories => this.categories = categories
    );

    this.isUserAdmin = this.authService.checkIsAdmin();
    window.io = require('socket.io-client');
    window.Echo = new Echo({
      broadcaster: 'socket.io',
      host: 'http://localhost:6001',
    });

    window.Echo.channel('laravel_database_comment')
      .listen('.App\\Events\\PostComment', (response) => {
        this.getPostIndexByID(response.data.post_id);
        this.posts[this.postIndex].comments.push(response.data);

      });
  }

  addPost(title: string, body: string, topicSlug: string): void {
    body = body.trim();
    const slug = 'post-' + postUUID;
    this.apiService.addPost({ slug, title, body, topic: topicSlug } as Post, postUUID)
      .subscribe(post => {
        post.comments = [];
        this.posts.unshift(post);
      });
  }

  deletePost(postIndex: number , id: string): void {

    this.apiService.deletePost(id).subscribe(isDelete => {
        // tslint:disable-next-line:triple-equals
      if (this.posts.length == 1) { this.posts = []; } else { this.posts.splice(postIndex, 1); }
    });
  }

  addComment(commentText: string , postId: string , i: number): void {
    commentText = commentText.trim();
    this.apiService.addComment({body: commentText, post_id: postId} as unknown as Comment)
      .subscribe(comment => {
        //
      });
  }

  getPostIndexByID(postID: string) {
    this.postIndex =  this.posts.findIndex(index => index.id === postID);
  }

  filterPosts(categorySlug: string): void {
    this.apiService.getFilteredPosts(categorySlug).subscribe(posts => this.posts = posts);
  }

}

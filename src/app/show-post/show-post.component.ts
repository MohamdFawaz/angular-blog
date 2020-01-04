import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../api-service.service';

import { Post } from '../_models/post';
import { AuthenticationService } from '../_services/AuthenticationService';

import {log} from 'util';
import {Category} from '../_models/category';

@Component({
  selector: 'app-show-post',
  templateUrl: './show-post.component.html',
  styleUrls: ['./show-post.component.css']
})
export class ShowPostComponent implements OnInit {
  posts: Post[];
  categories: Category[];
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
  }

  openEditPost(postIndex: number) {
    this.display1 = 'block';
    this.data.postId = this.posts[postIndex].id;
    this.data.title = this.posts[postIndex].title;
    this.data.body = this.posts[postIndex].body;
    this.data.postIndex = postIndex;
  }

  openEditComment(postIndex: number , commentIndex: number) {
    this.display2 = 'block';
    this.data.postId = this.posts[postIndex].id;
    this.data.commentId = this.posts[postIndex].comment[commentIndex].id;
    this.data.commentText = this.posts[postIndex].comment[commentIndex].commentText;
    this.data.commentIndex = commentIndex;
    this.data.postIndex = postIndex;
  }

  onCloseAndSaveEdit() {
    this.display1 = 'none';
    this.editPost( this.data.postId , this.data.body , this.data.postIndex );
  }

  onCloseAndSaveComment() {
    this.display2 = 'none';
    this.editComment( this.data.commentId , this.data.commentText , this.data.postId , this.data.commentIndex , this.data.postIndex);
  }

  onClose() {
    this.display1 = 'none';
    this.display2 = 'none';
  }

  addPost(body: string): void {
    body = body.trim();
    this.apiService.addPost({ body } as Post)
      .subscribe(post => {
        post.comment = [];
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

  addComment(commentText: string , postId: number , i: number): void {
    commentText = commentText.trim();
    this.apiService.addComment({commentText, postId} as unknown as Comment)
      .subscribe(comment => {
        this.posts[i].comment.push(comment);
      });
  }

  editComment(id: number , commentText: string , postId: string , commentIndex: number , postIndex: number): void {
    commentText = commentText.trim();
    this.apiService.editComment(id , {commentText, postId} as unknown as Comment)
      .subscribe(isEdit => {
        if (isEdit) { this.posts[postIndex].comment[commentIndex].commentText = commentText; }
      });
  }

  deleteComment(postIndex: number , commentIndex: number , id: string): void {
    this.apiService.deleteComment(id).subscribe(isDelete => {
      if (isDelete) {
        // tslint:disable-next-line:triple-equals
        if (this.posts[postIndex].comment.length == 1) {
          this.posts[postIndex].comment = [];
        } else {
          this.posts[postIndex].comment.splice(commentIndex, 1);
        }
      }
    });
  }

  filterPosts(categorySlug: string): void {
    this.apiService.getFilteredPosts(categorySlug).subscribe(posts => this.posts = posts);
  }

}

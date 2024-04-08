import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { Post } from 'src/app/models/post.interface';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss']
})
export class PostsListComponent implements OnInit {
  
  posts: Post[] = []

  constructor (private postSrv:PostService) {}
  ngOnInit(): void {
    this.postSrv.getPosts().subscribe(
      (data)=> {
        this.posts = data;
      }
    )
  }
}

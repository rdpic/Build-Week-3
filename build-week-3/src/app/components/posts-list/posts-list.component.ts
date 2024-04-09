import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import { Post } from 'src/app/models/post.interface';
import { User } from 'src/app/models/user.interface';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss']
})
export class PostsListComponent implements OnInit {

  posts: any[] = []; 
  users: {[key: string]: User} = {};

  constructor(private postSrv: PostService, private userSrv: UserService) {}

  ngOnInit(): void {
    this.userSrv.getUsers().subscribe(users => {
      this.users = users.reduce((acc, user) => ({...acc, [user.id]: user}), {});

      this.postSrv.getPosts().subscribe(posts => {
        this.posts = this.shuffleArray(posts.map(post => ({
          ...post,
          user: this.users[post.userId]
        })));
      });
    });
  }

  shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; 
    }
    return array;
  }
}
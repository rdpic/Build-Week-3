import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.interface';
import { Post } from 'src/app/models/post.interface';
import { PostService } from 'src/app/services/post.service';
import { AuthService } from 'src/app/auth/auth.service';
import { AuthData } from 'src/app/models/auth-data.interface';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  userId!: number | null;
  user!: User;
  posts!: Post[];

  constructor(
    private postSrv: PostService,
    private authSrv: AuthService,
    private userSrv: UserService
  ) {
    this.userId = this.authSrv.getCurrentUserId();
  }
  ngOnInit(): void {
    if (this.userId) {
      this.postSrv.getPostsByUserId(this.userId).subscribe(
        (posts) => {
          this.posts = posts;
        },
        (error) => {
          console.error('error: fetching posts');
        }
      );
    }
    if (this.userId) {
      this.userSrv.getUser(this.userId).subscribe(
        (user) => {
          this.user = user;
        },
        (error) => {
          console.error('error: fetching user');
        }
      );
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.interface';
import { Post } from 'src/app/models/post.interface';
import { PostService } from 'src/app/services/post.service';
import { AuthService } from 'src/app/auth/auth.service';
import { UserService } from 'src/app/services/user.service';
import { NgForm } from '@angular/forms';

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
    private userSrv: UserService,
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

  onSubmit(form: NgForm) {
    const userId = this.authSrv.getCurrentUserId();
    const post = {
      ...form.value,
      userId,
    };

    this.postSrv.newPost(post).subscribe({
      next: (response) => {
        console.log('Post created:', response);
      },
      error: (error) => {
        console.error('Error creating post:', error);
      },
    });
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
    form.reset();
  }

  onEdit(postId: number, updatedData: Partial<Post>): void {
    const userId = this.authSrv.getCurrentUserId();

    const post = { ...updatedData, userId };
    this.postSrv.updatePost(postId, post).subscribe({
      next: (response) => console.log('post updated', response),
    });
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
  }

  onDelete(id: number) {
    if (window.confirm('Are you sure of deleting this post?')) {
      this.postSrv.deletePost(id).subscribe();
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
    }
  }
}

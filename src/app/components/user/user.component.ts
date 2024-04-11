import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post.interface';
import { User } from 'src/app/models/user.interface';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  user!: User;
  posts!: Post[];

  constructor(
    private userSrv: UserService,
    private router: ActivatedRoute,
    private postSrv: PostService
  ) {}
  ngOnInit(): void {
    this.router.params.subscribe((params) => {
      const userId = +params['id'];
      if (userId) {
        this.userSrv.getUser(userId).subscribe((user) => {
          this.user = user;
        });
        this.postSrv.getPostsByUserId(userId).subscribe((posts) => {
          this.posts = posts;
        });
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post.interface';
import { User } from 'src/app/models/user.interface';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-cestino',
  templateUrl: './cestino.component.html',
  styleUrls: ['./cestino.component.scss']
})
export class CestinoComponent implements OnInit {
  deletedPosts: Post[] = [];

  constructor(private postSrv: PostService, private userSrv: UserService) {}
  ngOnInit(): void {
    
  }

}

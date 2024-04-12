import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import { Post } from 'src/app/models/post.interface';
import { User } from 'src/app/models/user.interface';
import { AuthService } from 'src/app/auth/auth.service';
import { Favourites } from 'src/app/models/favourites.interface';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss'],
})
export class PostsListComponent implements OnInit {
  posts: any[] = [];
  users: { [key: string]: User } = {};
  favourites: Favourites[] = []
  favouritePostsIds: Set<number> = new Set<number>();

  constructor(private postSrv: PostService, private userSrv: UserService, private authSrv: AuthService) {}

  ngOnInit(): void {
    this.userSrv.getUsers().subscribe((users) => {
      this.users = users.reduce(
        (acc, user) => ({ ...acc, [user.id]: user }),
        {}
      );

      this.postSrv.getPosts().subscribe((posts) => {
        this.posts = this.shuffleArray(
          posts.map((post) => ({
            ...post,
            user: this.users[post.userId!],
          }))
        );
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

  //------

  loadUserFavorites(): void {
    const userId = this.authSrv.getCurrentUserId();
    if (userId) {
        this.postSrv.getAllFavorites(userId).subscribe({
            next: (fetchedFavorites) => {
                this.favourites = fetchedFavorites;
            },
            error: (error) => console.error('Error loading favorites', error),
        });
    }
}

addFavorite(postId: number): void {
  const userId = this.authSrv.getCurrentUserId();
    if (userId) {
        this.postSrv.addFavorite(userId, postId).subscribe({
            next: (favorite) => {
                this.favourites.push(favorite);
                console.log('Favorite added:', postId);
            },
            error: (error) => console.error('Error adding favorite', error),
        });
    }
}

removeFavorite(postId: number): void {
    const favorite = this.getFavorite(postId);
    if (favorite) {
        this.postSrv.removeFavorite(favorite.id).subscribe({
            next: () => {
                this.favourites = this.favourites.filter(f => f.postId !== postId);
                console.log('Favorite removed:', postId);
            },
            error: (error) => console.error('Error removing favorite', error),
        });
    }
}

toggleFavorite(postId: number): void {
    console.log(`Toggling favorite for post ID: ${postId}`);

    if (this.isFavorite(postId)) {
        console.log(`Post ID ${postId} is currently a favorite. Removing...`);
        const favorite = this.getFavorite(postId);
        if (favorite) {
            this.postSrv.removeFavorite(favorite.id).subscribe({
                next: () => {
                    this.favouritePostsIds.delete(postId);
                    console.log(`Favorite removed: ${postId}`);
                    this.loadUserFavorites();
                },
                error: (error) => {
                    console.error('Error removing favorite', error);
                },
            });
        }
    } else {
        console.log(`Post ID ${postId} is not a favorite. Adding...`);
        const userId = this.authSrv.getCurrentUserId();
        if (userId) {
            this.postSrv.addFavorite(userId, postId).subscribe({
                next: () => {
                    console.log(`Favorite added: ${postId}`);
                    this.loadUserFavorites();
                },
                error: (error) => {
                    console.error('Error adding favorite', error);
                },
            });
        } else {
            console.error('User ID is null, cannot add favorite');
        }
    }
}

isFavorite(postId: number): boolean {
    return this.favourites.some(f => f.postId === postId);
}

getFavorite(postId: number): Favourites | undefined {
    return this.favourites.find(f => f.postId === postId);
}

getFavoriteId(postId: number): number | undefined {
    const favorite = this.favourites.find(f => f.postId === postId);
    return favorite ? favorite.id : undefined;
}
}

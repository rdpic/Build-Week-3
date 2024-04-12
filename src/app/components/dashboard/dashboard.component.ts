import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.interface';
import { Post } from 'src/app/models/post.interface';
import { PostService } from 'src/app/services/post.service';
import { AuthService } from 'src/app/auth/auth.service';
import { UserService } from 'src/app/services/user.service';
import { NgForm } from '@angular/forms';
import { catchError, forkJoin, of } from 'rxjs';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
    userId!: number | null;
    user!: User;
    posts: Post[] = [];
    toBeDeleted: number[] = [];
    favorites: Post[] = [];

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

        this.authSrv.user$.subscribe((auth) => {
            if (auth && auth.user) {
                this.loadUserFavorites(Number(auth.user.id));
            }
        });
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

    toggleDelete(postId: number): void {
        const index = this.toBeDeleted.indexOf(postId);
        if (index > -1) {
            this.toBeDeleted.splice(index, 1);
        } else {
            this.toBeDeleted.push(postId);
        }
        console.log(this.toBeDeleted);
    }

    finalizeDeletions(): void {
        this.toBeDeleted.forEach((id) => {
            this.postSrv.deletePost(id).subscribe({
                next: () => {
                    console.log(`Post ${id} deleted`);
                    this.posts = this.posts.filter((post) => post.id !== id);
                },
                error: (error) => console.error('Failed to delete post', error),
            });
        });
        this.toBeDeleted = [];
        alert('Post eliminated.');
    }

    //------
    loadUserFavorites(userId: number) {
        this.postSrv.getAllFavorites(userId).subscribe((favorites) => {
            console.log('All favorites fetched:', favorites);
    
            if (!favorites.length) {
                this.favorites = [];
                return;
            }
    
            const requests = favorites.map((fav) =>
                this.postSrv.getPost(fav.postId).pipe(
                    catchError((error) => {
                        console.error(`Error fetching post details for post ID ${fav.postId}: ${error}`);
                        return of(null);
                    })
                )
            );
            forkJoin(requests).subscribe((results) => {
                this.favorites = results.filter((result): result is Post => result !== null);
                console.log('Filtered favorites:', this.favorites);
            });
        });
    }
}

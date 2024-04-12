# Build-Week 3 - Group 2 - Project

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.13.

## How to run it locally

1. Download or clone the repository to your local machine:

```
https://github.com/rdpic/Build-Week-3
```

2. Run npm install inside the downloaded/cloned folder:

```
npm install
```

3. Start the server by running the command below. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

```
npm run fullstack
```

## What it is

We created a program that simulates some of the functionalities of a social media app.
Users can sign up and create their own profile, and are able to create, edit and delete posts; a separate page shows other users' posts that can be favorited, and other users' profiles can also be seen.

We used `Bootstrap` for the visual aspect of the project, and `JSON Server` to manage our data.
For the authentication process we used `JSON Server Auth`.

## How it works

### Login and register

When first launching the application, the user can choose between loggin in or signin up. We installed a `guard` on the inner content of the application, so that if a user is not logged in, they can only access the login and register pages - even if they manually search the urls.

### Dashboard

After logging in, the user is automatically redirected to their dashboard, where they can manage their posts.
The user can `create a new post` with the 'create post' button, which will activate a modal containing the post creation form;
through another modal triggered by the 'modify' button, a similar form will pop up which can be used to `edit` the post.
Posts can also be `deleted` in a two-steps process: clicking the 'delete' button on a post will temporarily disable the post, and can be undone; however, when the 'delete selected' is clicked all the previously disabled posts will be permanently deleted.
All these actions directly modify the db.json file.

On the right side of the dashboard, the user can find their liked posts; clicking the heart button will "un-like" the post and remove it from the page.

### Post List

On this page, posts from all users are shown in a random order which changes every time the page is refreshed.
Every post has a like button and a 'user profile' button: clicking on the latter will redirect to the page of the user who published the post.

### User profile

The user's profile page is mostly static, and shows all the selected user's posts.

## Contributors

[Vito Dagnello](https://github.com/vitod-ag)
[Riccardo Del Piccolo](https://github.com/rdpic)
[Luca Martella](https://github.com/martella93)
[Marcello Mercanzin](https://github.com/marcimerca)
[Clarissa Piovesan](https://github.com/clarissa1110)

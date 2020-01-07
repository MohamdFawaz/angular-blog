# AngularBlog

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.3.21.
This is a frontend blog system for posting and commenting on posts using 
[Laravel Blog](https://github.com/MohamdFawaz/laravel-blog) as a backend and postgresql as DB engine.

## How to Setup

To get this system working you have to have the following prerequisites installed:
[Redis](https://redis.io/),
[Nodejs](https://nodejs.org/en/),
[AngularCLI](https://cli.angular.io/).

Once cloned run `npm install` to install all dependencies in package.json file 

## Running the Server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`.
Make sure to start the backend system beforehand in order to be able to view posts and their categories.

## Starting Realtime Server
To be able to see changes in real time as users comments you'll need to start laravel echo server

Run `laravel-echo-server start` 

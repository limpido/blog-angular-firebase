import { Component, OnInit } from '@angular/core';
import {User} from "../models/user";
import {Blog} from "../models/blog";
import {AuthService} from "../services/auth.service";
import {first} from "rxjs/operators";
import {BlogService} from "../services/blog.service";
import {Tabs} from "../nav-bar/nav-bar.component";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  user: User;
  author: User;
  blogs: Array<Blog>;
  tabs = Tabs;
  hasMoreBlogs: boolean = true;
  defaultBlogSize: number = 3;
  loadMoreBlogs: boolean = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private blogService: BlogService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  async ngOnInit(): Promise<void> {
    this.user = this.authService.user ?? await this.authService.user$.pipe(first()).toPromise();
    const uid = this.route.snapshot.url[0].path;
    await Promise.all([
      this.author = await this.userService.getUserByUid(uid).pipe(first()).toPromise(),
      this.blogs = await this.blogService.getBlogs(uid, {limit: this.defaultBlogSize})
    ]);
    this.hasMoreBlogs = this.blogs.length === this.defaultBlogSize;
  }

  async selectBlog(blog: Blog) {
    await this.router.navigate([`/${this.author.uid}/blog/${blog.docId}`]);
  }

  async seeMoreBlogs() {
    this.loadMoreBlogs = true;
    const lastBlog: Blog = this.blogs[this.blogs.length-1];
    const newBlogs: Array<Blog> = await this.blogService.getBlogs(this.user.uid, {startAfter: lastBlog, limit: this.defaultBlogSize});
    this.hasMoreBlogs = newBlogs.length === this.defaultBlogSize;
    this.blogs = this.blogs.concat(newBlogs);
    this.loadMoreBlogs = false;
  }
}

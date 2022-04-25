import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {User} from "../models/user";
import {Blog} from "../models/blog";
import {AuthService} from "../services/auth.service";
import {BlogService} from "../services/blog.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnChanges {

  @Input() user: User;
  @Input() author: User;
  @Input() blogs: Array<Blog>;
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

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.hasMoreBlogs = this.blogs.length === this.defaultBlogSize;
  }

  async selectBlog(blog: Blog) {
    await this.router.navigate([`/${this.author.uid}/blog/${blog.docId}`]);
  }

  async seeMoreBlogs() {
    this.loadMoreBlogs = true;
    const lastBlog: Blog = this.blogs[this.blogs.length-1];
    const newBlogs: Array<Blog> = await this.blogService.getBlogs(this.author.uid, {startAfter: lastBlog, limit: this.defaultBlogSize});
    this.hasMoreBlogs = newBlogs.length === this.defaultBlogSize;
    this.blogs = this.blogs.concat(newBlogs);
    this.loadMoreBlogs = false;
  }
}

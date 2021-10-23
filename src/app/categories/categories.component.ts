import { Component, OnInit } from '@angular/core';
import {User} from "../models/user";
import {first} from "rxjs/operators";
import {AuthService} from "../services/auth.service";
import {Category} from "../models/category";
import {BlogService} from "../services/blog.service";
import {Blog} from "../models/blog";
import {ActivatedRoute, Router} from "@angular/router";
import {Tabs} from "../nav-bar/nav-bar.component";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  user: User;
  author: User;
  categories: Array<Category>;
  selectedCategory: Category;
  allBlogs: Array<Blog>;
  selectedBlogs: Array<Blog>;
  tabs = Tabs;
  defaultBlogSize: number = 3;
  loadMoreBlogs: boolean = false;
  hasMoreBlogs: boolean = true;

  constructor(
    private authService: AuthService,
    private blogService: BlogService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {
  }

  async ngOnInit(): Promise<void> {
    const uid = this.route.snapshot.url[0].path;
    await Promise.all([
      this.author = await this.userService.getUserByUid(uid).pipe(first()).toPromise(),
      this.categories = await this.blogService.getAllCategories(uid),
      this.allBlogs = await this.blogService.getBlogs(uid),
    ]);
    this.selectedBlogs = this.allBlogs.slice(0, this.defaultBlogSize);
    this.hasMoreBlogs = this.selectedBlogs.length === this.defaultBlogSize;
    this.user = this.authService.user ?? await this.authService.user$.pipe(first()).toPromise();
  }

  async selectCategory(category?: Category) {
    this.selectedCategory = category ?? null;
    this.selectedBlogs = await this.blogService.getBlogs(this.author.uid, {
      categoryName: this.selectedCategory?.name,
      limit: this.defaultBlogSize});
    this.hasMoreBlogs = this.selectedBlogs.length === this.defaultBlogSize;
  }

  async selectBlog(blog: Blog) {
    await this.router.navigate([`/${this.author.uid}/blog/${blog.docId}`]);
  }

  async seeMoreBlogs() {
    this.loadMoreBlogs = true;
    const lastBlog: Blog = this.selectedBlogs[this.selectedBlogs.length-1];
    const newBlogs: Array<Blog> = await this.blogService.getBlogs(this.author.uid, {
      categoryName: this.selectedCategory?.name,
      limit: this.defaultBlogSize,
      startAfter: lastBlog});
    this.hasMoreBlogs = newBlogs.length === this.defaultBlogSize;
    this.selectedBlogs = this.selectedBlogs.concat(newBlogs);
    this.loadMoreBlogs = false;
  }

}

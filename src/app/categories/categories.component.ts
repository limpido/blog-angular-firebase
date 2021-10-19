import { Component, OnInit } from '@angular/core';
import {User} from "../models/user";
import {first} from "rxjs/operators";
import {AuthService} from "../services/auth.service";
import {Category} from "../models/category";
import {BlogService} from "../services/blog.service";
import {Blog} from "../models/blog";
import {Router} from "@angular/router";
import {Tabs} from "../nav-bar/nav-bar.component";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  user: User;
  categories: Array<Category>;
  selectedCategory: Category;
  allBlogs: Array<Blog>;
  selectedBlogs: Array<Blog>;
  tabs = Tabs;

  constructor(
    private authService: AuthService,
    private blogService: BlogService,
    private router: Router,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.user = this.authService.user ?? await this.authService.user$.pipe(first()).toPromise();
    await Promise.all([
      this.categories = await this.blogService.getAllCategories(this.user.uid),
      this.allBlogs = await this.blogService.getAllBlogs(this.user.uid),
    ]);
    this.selectedBlogs = this.allBlogs;
  }

  async selectCategory(category?: Category) {
    this.selectedCategory = category ?? null;
    this.selectedBlogs = category ? await this.blogService.getBlogsByCategory(this.user.uid, category.name) : this.allBlogs;
  }

  async selectBlog(blog: Blog) {
    await this.router.navigate([`/${this.user.uid}/blog/${blog.docId}`]);
  }

}

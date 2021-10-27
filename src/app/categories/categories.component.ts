import {Component, Input, OnInit} from '@angular/core';
import {User} from "../models/user";
import {AuthService} from "../services/auth.service";
import {Category} from "../models/category";
import {BlogService} from "../services/blog.service";
import {Blog} from "../models/blog";
import {Router} from "@angular/router";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  @Input() user: User;
  @Input() author: User;
  categories: Array<Category>;
  selectedCategory: Category;
  @Input() allBlogs: Array<Blog>;
  selectedBlogs: Array<Blog>;
  defaultBlogSize: number = 3;
  loadMoreBlogs: boolean = false;
  hasMoreBlogs: boolean = true;
  allBlogsNumber: number = 0;

  constructor(
    private authService: AuthService,
    private blogService: BlogService,
    private router: Router,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.categories = await this.blogService.getAllCategories(this.author.uid);
    this.selectedBlogs = this.allBlogs.slice(0, this.defaultBlogSize);
    this.hasMoreBlogs = this.selectedBlogs.length === this.defaultBlogSize;
    for (let category of this.categories) {
      this.allBlogsNumber += category.blog_number;
    }
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

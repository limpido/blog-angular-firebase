import { Component, OnInit } from '@angular/core';
import {User} from "../models/user";
import {Blog} from "../models/blog";
import {Tabs} from "../nav-bar/nav-bar.component";
import {first} from "rxjs/operators";
import {AuthService} from "../services/auth.service";
import {UserService} from "../services/user.service";
import {BlogService} from "../services/blog.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from '@angular/common';

@Component({
  selector: 'app-blog-base',
  templateUrl: './blog-base.component.html',
  styleUrls: ['./blog-base.component.scss']
})
export class BlogBaseComponent implements OnInit {

  user: User;
  author: User;
  tabs = Tabs;
  activeTabIndex: number;
  isReady: boolean = false;
  defaultBlogSize: number = 3;
  blogs: Array<Blog>;
  tabRoutes: Array<string>;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private blogService: BlogService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) { }

  async ngOnInit(): Promise<void> {
    this.activeTabIndex = this.route.snapshot.url[1]?.path === 'categories' ? this.tabs.category : this.tabs.home;
    this.user = this.authService.user ?? await this.authService.getUser();
    this.route.params.subscribe(async (params) => {
      const uid = this.route.snapshot.url[0].path;
      await Promise.all([
        this.author = uid === this.user.uid ? this.user : await this.userService.getUserByUid(uid).pipe(first()).toPromise(),
        this.blogs = await this.blogService.getBlogs(uid, {limit: this.defaultBlogSize})
      ]);
      this.tabRoutes = [
        `${uid}`,
        `${uid}/categories`
      ];
      this.isReady = true;
    });
  }

  activeTabChange(index: number) {
    this.activeTabIndex = index;
    this.location.replaceState(`${this.tabRoutes[index]}`);
  }

}

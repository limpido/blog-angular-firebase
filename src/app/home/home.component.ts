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

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private blogService: BlogService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  async ngOnInit(): Promise<void> {
    const uid = this.route.snapshot.url[0].path;
    this.user = this.authService.user ?? await this.authService.user$.pipe(first()).toPromise();
    await Promise.all([
      this.author = await this.userService.getUserByUid(uid).pipe(first()).toPromise(),
      this.blogs = await this.blogService.getAllBlogs(uid)
    ]);
  }

  async selectBlog(blog: Blog) {
    await this.router.navigate([`/blog/${this.user.uid}/${blog.docId}`]);
  }
}

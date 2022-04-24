import {Component, HostListener, OnInit} from '@angular/core';
import {Blog} from "../models/blog";
import {ViewportScroller} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {BlogService} from "../services/blog.service";
import {User} from "../models/user";
import {UserService} from "../services/user.service";
import {first} from "rxjs/operators";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-preview-blog',
  templateUrl: './view-blog.component.html',
  styleUrls: ['./view-blog.component.scss']
})
export class ViewBlogComponent implements OnInit {

  user: User;
  blog: Blog;
  author: User;
  lastEditDate: string;
  blogId: string;
  isOwn: boolean;

  pageYOffset: number;
  @HostListener('window:scroll', ['$event']) onScroll(){
    this.pageYOffset = window.pageYOffset;
  }

  constructor(
    private scroll: ViewportScroller,
    private route: ActivatedRoute,
    private blogService: BlogService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
  ) {}

  async ngOnInit(): Promise<void> {
    this.user = this.authService.user ?? await this.authService.getUser();
    const uid = this.route.snapshot.url[0].path;
    this.blogId = this.route.snapshot.url[2].path;
    await Promise.all([
      this.blog = await this.blogService.getBlogById(uid, this.blogId),
      this.author = await this.userService.getUserByUid(uid).pipe(first()).toPromise()
    ]);
    this.isOwn = this.user?.uid === this.author.uid;

    const timeStamp = new Date(this.blog.last_edited_timestamp);
    const year = timeStamp.getFullYear();
    const month = timeStamp.getMonth()+1;
    const day = timeStamp.getDate();
    this.lastEditDate = `${year}-${month}-${day}`;
  }

  scrollToTop() {
    this.scroll.scrollToPosition([0,0]);
  }

  async editBlog() {
    await this.router.navigate([`${this.user.uid}/write`, {blogId: this.blogId}]);
  }
}

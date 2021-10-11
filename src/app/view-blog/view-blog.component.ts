import {Component, HostListener, OnInit} from '@angular/core';
import {Blog} from "../models/blog";
import {ViewportScroller} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {BlogService} from "../services/blog.service";
import {User} from "../models/user";
import {UserService} from "../services/user.service";
import {first} from "rxjs/operators";

@Component({
  selector: 'app-preview-blog',
  templateUrl: './view-blog.component.html',
  styleUrls: ['./view-blog.component.scss']
})
export class ViewBlogComponent implements OnInit {

  blog: Blog;
  author: User;
  lastEditDate: string;

  pageYOffset: number;
  @HostListener('window:scroll', ['$event']) onScroll(){
    this.pageYOffset = window.pageYOffset;
  }

  constructor(
    private scroll: ViewportScroller,
    private route: ActivatedRoute,
    private blogService: BlogService,
    private userService: UserService
  ) {
    console.log(this.route.snapshot.url);
  }

  async ngOnInit(): Promise<void> {
    const uid = this.route.snapshot.url[1].path;
    const blogId = this.route.snapshot.url[2].path;
    this.blog = await this.blogService.getBlogById(uid, blogId);
    this.author = await this.userService.getUserByUid(uid).pipe(first()).toPromise();
    console.log(this.blog);

    const timeStamp = new Date(this.blog.last_edited_timestamp);
    const year = timeStamp.getFullYear();
    const month = timeStamp.getMonth()+1;
    const day = timeStamp.getDate();
    this.lastEditDate = `${year}-${month}-${day}`;
  }

  scrollToTop() {
    this.scroll.scrollToPosition([0,0]);
  }
}

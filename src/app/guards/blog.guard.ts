import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AuthService} from "../services/auth.service";
import {User} from "../models/user";
import {first} from "rxjs/operators";
import {UserService} from "../services/user.service";
import {BlogService} from "../services/blog.service";
import {Blog} from "../models/blog";

@Injectable({
  providedIn: 'root'
})
export class BlogGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private blogService: BlogService,
    private router: Router,
  ) {}

  // for access to blog base & view blog page
  // check if author and the blog exists
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    const uid = route.url[0].path;
    const author: User = await this.userService.getUserByUid(uid).pipe(first()).toPromise();
    if (route.url[1]?.path === "blog") {   // view blog
      const blogId = route.url[2]?.path;
      let blog: Blog;
      if (blogId) {
        blog = await this.blogService.getBlogById(uid, blogId);
      }
      return !!author && !!blog ? true : this.router.parseUrl(`/`);
    } else return !!author ? true : this.router.parseUrl(`/`);  // blog base
  }

}

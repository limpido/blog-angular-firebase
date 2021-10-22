import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AuthService} from "../services/auth.service";
import {User} from "../models/user";
import {first} from "rxjs/operators";
import {UserService} from "../services/user.service";

@Injectable({
  providedIn: 'root'
})
export class BlogGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    const uid = route.url[0].path;
    const author: User = await this.userService.getUserByUid(uid).pipe(first()).toPromise();
    return !!author ? true : this.router.parseUrl(`/`);
  }

}

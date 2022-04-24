import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AuthService} from "../services/auth.service";
import {User} from "../models/user";
import {first} from "rxjs/operators";
import {UserService} from "../services/user.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
  ) {
  }

  // for access to write blog page
  // check if user and author are the same
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    const uid = route.url[0].path;
    const user: User = this.authService.user ?? await this.authService.getUser();
    const author: User = await this.userService.getUserByUid(uid).pipe(first()).toPromise();
    if (user && user.uid === author?.uid) {
      return true;
    } else return this.router.parseUrl(`/`);
  }

}

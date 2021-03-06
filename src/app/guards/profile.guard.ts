import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AuthService} from "../services/auth.service";
import {User} from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class ProfileGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  // for access to profile page
  // check if there is a logged-in user
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    const user: User = this.authService.user ?? await this.authService.getUser();
    return !!user ? true : this.router.parseUrl(`/`);
  }

}

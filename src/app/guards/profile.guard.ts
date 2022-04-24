import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AuthService} from "../services/auth.service";
import {User} from "../models/user";
import {first} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ProfileGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    const user: User = this.authService.user ?? await this.authService.getUser();
    return !!user ? true : this.router.parseUrl(`/`);
  }

}

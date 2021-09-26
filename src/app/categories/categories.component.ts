import { Component, OnInit } from '@angular/core';
import {User} from "../models/user";
import {first} from "rxjs/operators";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  user: User;

  constructor(
    private authService: AuthService
  ) { }

  async ngOnInit(): Promise<void> {
    this.user = this.authService.user ?? await this.authService.user$.pipe(first()).toPromise();

  }

}

import { Component, OnInit } from '@angular/core';
import {AuthService} from "../services/auth.service";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../services/user.service";
import {User} from "../models/user";

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  constructor(

  ) {

  }

  ngOnInit(): void {
  }

}

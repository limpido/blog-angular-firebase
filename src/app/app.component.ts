import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AuthService} from "./services/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'blog-angular-firebase';

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.authService.init();
  }

}

import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {User} from "../../models/user";
import {first} from "rxjs/operators";
import {AuthService} from "../../services/auth.service";
import {BlogEditorComponent} from "../blog-editor/blog-editor.component";

@Component({
  selector: 'app-write-blog',
  templateUrl: './write-blog.component.html',
  styleUrls: ['./write-blog.component.scss']
})
export class WriteBlogComponent implements OnInit {

  user: User;
  @ViewChild(BlogEditorComponent) blogEditor: BlogEditorComponent;

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit(): Promise<void> {
    this.user = this.authService.user ?? await this.authService.user$.pipe(first()).toPromise();
    console.log(this.user);
    this.cdr.detectChanges();
  }


  onSubmit() {
    console.log(this.blogEditor.markdown);
  }

  onExit() {

  }

}

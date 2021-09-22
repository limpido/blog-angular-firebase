import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {User} from "../../models/user";
import {first} from "rxjs/operators";
import {AuthService} from "../../services/auth.service";
import {BlogEditorComponent} from "../blog-editor/blog-editor.component";
import {Blog} from "../../models/blog";
import {Category} from "../../models/category";
import {BlogService} from "../../services/blog.service";

@Component({
  selector: 'app-write-blog',
  templateUrl: './write-blog.component.html',
  styleUrls: ['./write-blog.component.scss']
})
export class WriteBlogComponent implements OnInit {

  user: User;
  @ViewChild(BlogEditorComponent) blogEditor: BlogEditorComponent;
  lastEditDate: string;

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private blogService: BlogService
  ) { }

  async ngOnInit(): Promise<void> {
    this.user = this.authService.user ?? await this.authService.user$.pipe(first()).toPromise();
    console.log(this.user);
    this.cdr.detectChanges();

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    this.lastEditDate = `${year}-${month}-${day}`;
  }


  async onSubmit(): Promise<void> {
    const blogInfoForm = this.blogEditor.blogInfoForm;
    blogInfoForm.markAllAsTouched();

    if (blogInfoForm.valid) {
      //TODO: update category: blog_number ++
      const cat = blogInfoForm.get('category').value;
      const blog: Blog = {
        category_name: cat.name,
        title: blogInfoForm.get('title').value.trim(),
        summary: blogInfoForm.get('summary').value.trim(),
        image_url: blogInfoForm.get('image_url').value,
        content: this.blogEditor.markdown,
        last_edited_timestamp: Date.now()
      }
      console.log(blog);
      await this.blogService.addBlog(this.user.uid, blog);
    }
  }

  onExit() {

  }

}

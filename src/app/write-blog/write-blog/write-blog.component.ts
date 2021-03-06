import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {User} from "../../models/user";
import {first} from "rxjs/operators";
import {AuthService} from "../../services/auth.service";
import {BlogEditorComponent} from "../blog-editor/blog-editor.component";
import {Blog} from "../../models/blog";
import {BlogService} from "../../services/blog.service";
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";
import {ViewportScroller} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {Category} from "../../models/category";

@Component({
  selector: 'app-write-blog',
  templateUrl: './write-blog.component.html',
  styleUrls: ['./write-blog.component.scss']
})
export class WriteBlogComponent implements OnInit {

  @ViewChild(BlogEditorComponent) blogEditor: BlogEditorComponent;
  user: User;
  blog: Blog;
  blogId: string;
  lastEditDate: string;
  isReady: boolean = false;
  originalCategory: Category;

  pageYOffset: number;
  @HostListener('window:scroll', ['$event']) onScroll(){
    this.pageYOffset = window.pageYOffset;
  }

  constructor(
    private authService: AuthService,
    private blogService: BlogService,
    private snackBar: MatSnackBar,
    private scroll: ViewportScroller,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  async ngOnInit(): Promise<void> {
    this.user = this.authService.user ?? await this.authService.getUser();

    await this.activatedRoute.paramMap.pipe(first()).toPromise().then(async (params) => {
      this.blogId = params.get('blogId');
      if (this.blogId) {
        this.blog = await this.blogService.getBlogById(this.user.uid, this.blogId);
        this.originalCategory = this.blog.category;
      }
    });

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    this.lastEditDate = `${year}-${month}-${day}`;

    this.isReady = true;
  }

  scrollToTop() {
    this.scroll.scrollToPosition([0,0]);
  }

  async onSubmit(): Promise<void> {
    const blogInfoForm = this.blogEditor.blogInfoForm;
    blogInfoForm.markAllAsTouched();

    if (blogInfoForm.valid) {
      const cat = blogInfoForm.get('category').value;
      const blog: Blog = {
        category: {name: cat.name},
        title: blogInfoForm.get('title').value.trim(),
        summary: blogInfoForm.get('summary').value.trim(),
        image_url: blogInfoForm.get('image_url').value,
        content: this.blogEditor.markdown,
        last_edited_timestamp: Date.now()
      }
      if (this.blogId) {    // update blog
        if (this.originalCategory.name !== cat.name) {  // category is changed
          await Promise.all([
            this.blogService.incrementCategoryBlogNumber(this.user.uid, cat.name, 1),
            this.blogService.incrementCategoryBlogNumber(this.user.uid, this.originalCategory.name, -1),
            await this.blogService.updateBlog(this.user.uid, this.blogId, blog)
          ]);
        } else await this.blogService.updateBlog(this.user.uid, this.blogId, blog);
      } else {              // new blog
        await Promise.all([
          this.blogService.incrementCategoryBlogNumber(this.user.uid, cat.name, 1),
          this.blogService.addBlog(this.user.uid, blog).then((docRef) => {
            blog.docId = docRef.id;
          })]);
      }
      await this.router.navigate([`${this.user.uid}/blog/${this.blogId ?? blog.docId}`]);
    } else {
      const blogInfoFormInvalidMessage = `You have unfilled fields`;
      const config = {
        horizontalPosition: 'end' as MatSnackBarHorizontalPosition,
        verticalPosition: 'top' as MatSnackBarVerticalPosition,
        duration: 3000
      };
      this.snackBar.open(blogInfoFormInvalidMessage, 'OK', config);
    }
  }

  async onExit() {
    const res = window.confirm('Exit? Your changes will be discarded.');
    if (res) {
      await this.router.navigate([`/${this.user.uid}`]);
    }
  }
}

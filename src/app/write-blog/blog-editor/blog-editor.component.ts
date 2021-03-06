import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../../models/user";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {Category} from "../../models/category";
import {BlogService} from "../../services/blog.service";
import {Blog} from "../../models/blog";
import {Observable} from "rxjs";

@Component({
  selector: 'app-blog-editor',
  templateUrl: './blog-editor.component.html',
  styleUrls: ['./blog-editor.component.scss']
})
export class BlogEditorComponent implements OnInit {

  @Input() user: User;
  @Input() blog: Blog;
  blogInfoForm: FormGroup;
  imgUploadPercentage: Observable<number>;
  categories: Array<Category>;
  showAddCategory: boolean = false;
  newCategoryName: string = '';
  showCategoryExistedError: boolean = false;
  markdown: string;

  constructor(
    private formBuilder: FormBuilder,
    private storage: AngularFireStorage,
    private blogService: BlogService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.markdown = this.blog?.content ?? '';
    this.blogInfoForm = this.formBuilder.group({
      title: [this.blog?.title ?? null, [Validators.required, Validators.maxLength(30)]],
      summary: [this.blog?.summary ?? null, [Validators.required, Validators.maxLength(60)]],
      category: [this.blog?.category ?? null, [Validators.required]],
      image_url: [this.blog?.image_url ?? null]
    });
    this.categories = await this.blogService.getAllCategories(this.user.uid) ?? [];
  }

  get category(): FormControl {
    return this.blogInfoForm.get('category') as FormControl;
  }

  uploadImage(event: any): void {
    const file = event.target.files[0];
    const uidLast4 = this.user.uid.slice(-4);
    const filePath = `images/blog_images/${this.user.username}-${uidLast4}/${Date.now()}`;
    const task = this.storage.upload(filePath, file);
    this.imgUploadPercentage = task.percentageChanges();
    task.then(() => {
      this.storage.ref(filePath).getDownloadURL().subscribe(async (downloadURL: string) => {
        this.imgUploadPercentage = null;
        this.blogInfoForm.get('image_url').setValue(downloadURL);
      })
    });
  }

  deleteImage(): void {
    this.blogInfoForm.get('image_url').setValue(null);
  }

  toggleAddCategory(): void {
    this.showAddCategory = !this.showAddCategory;
  }

  async addCategory(name: string): Promise<void> {
    if (this.categories.filter(cat => cat.name === name).length > 0) {
      this.showCategoryExistedError = true;
    } else {
      this.showCategoryExistedError = false;
      const category: Category = {
        name,
        blog_number: 0
      };
      this.categories.push(category);
      this.newCategoryName = '';
      this.toggleAddCategory();
      await this.blogService.setCategory(this.user.uid, category);
    }
  }

  objectComparisonFunction( option: Category, value: Category ) : boolean {
    return option.name === value?.name;
  }

}

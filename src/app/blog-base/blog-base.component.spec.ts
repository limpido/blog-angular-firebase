import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogBaseComponent } from './blog-base.component';

describe('BlogBaseComponent', () => {
  let component: BlogBaseComponent;
  let fixture: ComponentFixture<BlogBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogBaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

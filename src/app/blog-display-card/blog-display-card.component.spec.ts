import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogDisplayCardComponent } from './blog-display-card.component';

describe('BlogDisplayCardComponent', () => {
  let component: BlogDisplayCardComponent;
  let fixture: ComponentFixture<BlogDisplayCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogDisplayCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogDisplayCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

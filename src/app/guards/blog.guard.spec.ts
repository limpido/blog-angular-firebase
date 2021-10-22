import { TestBed } from '@angular/core/testing';

import { BlogGuard } from './blog.guard';

describe('BlogGuard', () => {
  let guard: BlogGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(BlogGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

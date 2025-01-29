import { TestBed } from '@angular/core/testing';

import { ReownService } from './reown.service';

describe('ReownService', () => {
  let service: ReownService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReownService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

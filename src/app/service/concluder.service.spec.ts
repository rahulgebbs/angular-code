import { TestBed, inject } from '@angular/core/testing';

import { ConcluderService } from './concluder.service';

describe('ConcluderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConcluderService]
    });
  });

  it('should be created', inject([ConcluderService], (service: ConcluderService) => {
    expect(service).toBeTruthy();
  }));
});

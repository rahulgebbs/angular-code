import { TestBed, inject } from '@angular/core/testing';

import { PcnService } from './pcn.service';

describe('PcnService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PcnService]
    });
  });

  it('should be created', inject([PcnService], (service: PcnService) => {
    expect(service).toBeTruthy();
  }));
});

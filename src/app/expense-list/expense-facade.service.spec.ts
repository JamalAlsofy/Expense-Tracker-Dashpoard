import { TestBed } from '@angular/core/testing';

import { ExpenseFacadeService } from './expense-facade.service';

describe('ExpenseFacadeService', () => {
  let service: ExpenseFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpenseFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

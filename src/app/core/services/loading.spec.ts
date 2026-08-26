import { TestBed } from '@angular/core/testing';

import { LoadingService } from './loading';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set loading state to true when show is called', () => {
    service.show();

    expect(service.loading()).toBe(true);
  });

  it('should set loading state to false when hide is called', () => {
    service.show();
    service.hide();

    expect(service.loading()).toBe(false);
  });

  it('should keep loading multi loading', () => {
    service.show();
    service.show();
    service.hide();
    expect(service.loading()).toBe(true);

    service.hide();
    expect(service.loading()).toBe(false);
  });
});

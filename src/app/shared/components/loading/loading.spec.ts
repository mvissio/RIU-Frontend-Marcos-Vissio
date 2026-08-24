import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingService } from '../../../core/services/loading';
import { LoadingComponent } from './loading';
import { signal } from '@angular/core';

describe('LoadingComponent', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;

  const loadingServiceMock = {
    loading: signal(false),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingComponent],
      providers: [
        {
          provide: LoadingService,
          useValue: loadingServiceMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show progress bar when loading is true', () => {
    loadingServiceMock.loading.set(true);

    fixture.detectChanges();

    const progressBar = fixture.nativeElement.querySelector('mat-progress-bar');

    expect(progressBar).toBeTruthy();
  });

  it('should not show progress bar when loading is false', () => {
    loadingServiceMock.loading.set(false);

    fixture.detectChanges();

    const progressBar = fixture.nativeElement.querySelector('mat-progress-bar');

    expect(progressBar).toBeNull();
  });
});

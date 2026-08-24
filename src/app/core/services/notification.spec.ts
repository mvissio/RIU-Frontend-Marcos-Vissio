import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from './notification';


describe('NotificationService', () => {
  let service: NotificationService;

  const snackBar = {
    open: vi.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: MatSnackBar,
          useValue: snackBar,
        },
      ],
    });

    service = TestBed.inject(NotificationService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show notification message', () => {
    service.show('Test message');

    expect(snackBar.open).toHaveBeenCalledWith('Test message', 'Cerrar', {
      duration: 3000,
    });
  });
});

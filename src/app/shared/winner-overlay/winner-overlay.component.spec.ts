import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WinnerOverlayComponent } from './winner-overlay.component';

describe('WinnerOverlayComponent', () => {
  let component: WinnerOverlayComponent;
  let fixture: ComponentFixture<WinnerOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WinnerOverlayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WinnerOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

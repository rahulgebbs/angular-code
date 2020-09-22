import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordNewComponent } from './forgot-password-new.component';

describe('ForgotPasswordNewComponent', () => {
  let component: ForgotPasswordNewComponent;
  let fixture: ComponentFixture<ForgotPasswordNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotPasswordNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

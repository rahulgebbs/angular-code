import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcluderHelpImageComponent } from './concluder-help-image.component';

describe('ConcluderHelpImageComponent', () => {
  let component: ConcluderHelpImageComponent;
  let fixture: ComponentFixture<ConcluderHelpImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConcluderHelpImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcluderHelpImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

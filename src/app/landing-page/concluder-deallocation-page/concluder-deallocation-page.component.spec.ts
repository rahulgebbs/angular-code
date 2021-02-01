import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcluderDeallocationPageComponent } from './concluder-deallocation-page.component';

describe('ConcluderDeallocationPageComponent', () => {
  let component: ConcluderDeallocationPageComponent;
  let fixture: ComponentFixture<ConcluderDeallocationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConcluderDeallocationPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcluderDeallocationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

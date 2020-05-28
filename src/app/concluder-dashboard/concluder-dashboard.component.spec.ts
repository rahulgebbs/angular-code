import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcluderDashboardComponent } from './concluder-dashboard.component';

describe('ConcluderDashboardComponent', () => {
  let component: ConcluderDashboardComponent;
  let fixture: ComponentFixture<ConcluderDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConcluderDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcluderDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

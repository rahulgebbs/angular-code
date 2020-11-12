import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectAndPriorityDashboardComponent } from './project-and-priority-dashboard.component';

describe('ProjectAndPriorityDashboardComponent', () => {
  let component: ProjectAndPriorityDashboardComponent;
  let fixture: ComponentFixture<ProjectAndPriorityDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectAndPriorityDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectAndPriorityDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

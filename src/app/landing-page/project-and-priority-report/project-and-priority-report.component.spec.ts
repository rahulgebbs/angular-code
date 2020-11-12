import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectAndPriorityReportComponent } from './project-and-priority-report.component';

describe('ProjectAndPriorityReportComponent', () => {
  let component: ProjectAndPriorityReportComponent;
  let fixture: ComponentFixture<ProjectAndPriorityReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectAndPriorityReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectAndPriorityReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

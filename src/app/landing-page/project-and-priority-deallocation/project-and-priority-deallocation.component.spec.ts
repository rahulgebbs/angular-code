import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectAndPriorityDeallocationComponent } from './project-and-priority-deallocation.component';

describe('ProjectAndPriorityDeallocationComponent', () => {
  let component: ProjectAndPriorityDeallocationComponent;
  let fixture: ComponentFixture<ProjectAndPriorityDeallocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectAndPriorityDeallocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectAndPriorityDeallocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

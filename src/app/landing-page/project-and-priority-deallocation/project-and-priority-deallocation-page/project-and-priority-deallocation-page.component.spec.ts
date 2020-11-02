import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectAndPriorityDeallocationPageComponent } from './project-and-priority-deallocation-page.component';

describe('ProjectAndPriorityDeallocationPageComponent', () => {
  let component: ProjectAndPriorityDeallocationPageComponent;
  let fixture: ComponentFixture<ProjectAndPriorityDeallocationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectAndPriorityDeallocationPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectAndPriorityDeallocationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

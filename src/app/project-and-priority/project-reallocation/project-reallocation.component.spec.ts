import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectReallocationComponent } from './project-reallocation.component';

describe('ProjectReallocationComponent', () => {
  let component: ProjectReallocationComponent;
  let fixture: ComponentFixture<ProjectReallocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectReallocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectReallocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

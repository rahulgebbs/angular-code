import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDeactivateConfirmationComponent } from './project-deactivate-confirmation.component';

describe('ProjectDeactivateConfirmationComponent', () => {
  let component: ProjectDeactivateConfirmationComponent;
  let fixture: ComponentFixture<ProjectDeactivateConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectDeactivateConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDeactivateConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

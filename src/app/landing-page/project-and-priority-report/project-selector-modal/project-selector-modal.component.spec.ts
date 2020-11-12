import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSelectorModalComponent } from './project-selector-modal.component';

describe('ProjectSelectorModalComponent', () => {
  let component: ProjectSelectorModalComponent;
  let fixture: ComponentFixture<ProjectSelectorModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectSelectorModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectSelectorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

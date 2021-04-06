import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisorInboxMappingComponent } from './supervisor-inbox-mapping.component';

describe('SupervisorInboxMappingComponent', () => {
  let component: SupervisorInboxMappingComponent;
  let fixture: ComponentFixture<SupervisorInboxMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupervisorInboxMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisorInboxMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

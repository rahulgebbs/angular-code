import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeactivateProjectComponent } from './deactivate-project.component';

describe('DeactivateProjectComponent', () => {
  let component: DeactivateProjectComponent;
  let fixture: ComponentFixture<DeactivateProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeactivateProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeactivateProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

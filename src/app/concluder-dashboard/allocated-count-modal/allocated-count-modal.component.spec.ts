import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocatedCountModalComponent } from './allocated-count-modal.component';

describe('AllocatedCountModalComponent', () => {
  let component: AllocatedCountModalComponent;
  let fixture: ComponentFixture<AllocatedCountModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllocatedCountModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllocatedCountModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

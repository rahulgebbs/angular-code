import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPcnModalComponent } from './add-pcn-modal.component';

describe('AddPcnModalComponent', () => {
  let component: AddPcnModalComponent;
  let fixture: ComponentFixture<AddPcnModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPcnModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPcnModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

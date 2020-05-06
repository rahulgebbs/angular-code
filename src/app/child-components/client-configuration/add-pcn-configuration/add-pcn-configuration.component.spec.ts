import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPcnConfigurationComponent } from './add-pcn-configuration.component';

describe('AddPcnConfigurationComponent', () => {
  let component: AddPcnConfigurationComponent;
  let fixture: ComponentFixture<AddPcnConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPcnConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPcnConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

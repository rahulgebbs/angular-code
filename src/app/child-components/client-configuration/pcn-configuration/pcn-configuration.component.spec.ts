import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PcnConfigurationComponent } from './pcn-configuration.component';

describe('PcnConfigurationComponent', () => {
  let component: PcnConfigurationComponent;
  let fixture: ComponentFixture<PcnConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PcnConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PcnConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

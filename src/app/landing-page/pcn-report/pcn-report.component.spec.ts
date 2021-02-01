import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PcnReportComponent } from './pcn-report.component';

describe('PcnReportComponent', () => {
  let component: PcnReportComponent;
  let fixture: ComponentFixture<PcnReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PcnReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PcnReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

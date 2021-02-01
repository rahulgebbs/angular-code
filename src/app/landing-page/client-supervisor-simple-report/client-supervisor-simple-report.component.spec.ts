import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSupervisorSimpleReportComponent } from './client-supervisor-simple-report.component';

describe('ClientSupervisorSimpleReportComponent', () => {
  let component: ClientSupervisorSimpleReportComponent;
  let fixture: ComponentFixture<ClientSupervisorSimpleReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientSupervisorSimpleReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientSupervisorSimpleReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

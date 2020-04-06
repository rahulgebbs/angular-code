import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentConcluderComponent } from './agent-concluder.component';

describe('AgentConcluderComponent', () => {
  let component: AgentConcluderComponent;
  let fixture: ComponentFixture<AgentConcluderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentConcluderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentConcluderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

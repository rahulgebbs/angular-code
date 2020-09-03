import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientInstructionInfoComponent } from './client-instruction-info.component';

describe('ClientInstructionInfoComponent', () => {
  let component: ClientInstructionInfoComponent;
  let fixture: ComponentFixture<ClientInstructionInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientInstructionInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientInstructionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

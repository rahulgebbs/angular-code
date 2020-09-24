import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsModalProjectAndPriorityComponent } from './accounts-modal-project-and-priority.component';

describe('AccountsModalProjectAndPriorityComponent', () => {
  let component: AccountsModalProjectAndPriorityComponent;
  let fixture: ComponentFixture<AccountsModalProjectAndPriorityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountsModalProjectAndPriorityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsModalProjectAndPriorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

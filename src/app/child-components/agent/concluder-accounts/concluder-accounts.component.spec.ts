import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcluderAccountsComponent } from './concluder-accounts.component';

describe('ConcluderAccountsComponent', () => {
  let component: ConcluderAccountsComponent;
  let fixture: ComponentFixture<ConcluderAccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConcluderAccountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcluderAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

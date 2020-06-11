import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToBeConcluderAccountsComponent } from './to-be-concluder-accounts.component';

describe('ToBeConcluderAccountsComponent', () => {
  let component: ToBeConcluderAccountsComponent;
  let fixture: ComponentFixture<ToBeConcluderAccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToBeConcluderAccountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToBeConcluderAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

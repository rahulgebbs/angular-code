import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CelTooltipTextComponent } from './cel-tooltip-text.component';

describe('CelTooltipTextComponent', () => {
  let component: CelTooltipTextComponent;
  let fixture: ComponentFixture<CelTooltipTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CelTooltipTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CelTooltipTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

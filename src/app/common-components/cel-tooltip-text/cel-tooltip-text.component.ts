import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cel-tooltip-text',
  templateUrl: './cel-tooltip-text.component.html',
  styleUrls: ['./cel-tooltip-text.component.css']
})
export class CelTooltipTextComponent implements OnInit {

  private params: any;
  constructor() { }

  ngOnInit() {
  }

  agInit(params: any): void {
    this.params = params;
  }

  refresh(params: any): boolean {
    this.params = params;

    return true;
  }

  private valueBasic(): string {
    console.log('valueBasic : ',this.params)
    return "<b>" + this.params.value + "</b>";
  }

}

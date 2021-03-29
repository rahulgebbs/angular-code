import { Component, OnInit } from '@angular/core';
// declare var AgRendererComponent: any;
// declare var ICellRendererParams: any;
// import { AgRendererComponent } from '@ag-grid-community/angular';
// import { ICellRendererParams } from '@ag-grid-community/core';
@Component({
  selector: 'app-select-box',
  templateUrl: './select-box.component.html',
  styleUrls: ['./select-box.component.css']
})
export class SelectBoxComponent implements OnInit {
  private cellValue: string;
  activeParams;
  optionList = [{
    name: 'Yes',
    value: 'yes'
  }, {
    name: 'No',
    value: 'no'
  }, {
    name: 'Need Clarification',
    value: 'need clarification'
  }]
  constructor() { }

  ngOnInit() {
  }
  // gets called once before the renderer is used
  agInit(params): void {
    // this.cellValue = this.getValueToDisplay(params);
    console.log('agInit : ', params.value, params);
    this.activeParams = params;
  }

  // gets called whenever the user gets the cell to refresh
  refresh(params) {
    // set value into cell again
    // this.cellValue = this.getValueToDisplay(params);
    console.log('refresh : ', params);
  }

  buttonClicked() {
    alert(`${this.cellValue} medals won!`);
  }

  // getValueToDisplay(params: ICellRendererParams) {
  //   return params.valueFormatted ? params.valueFormatted : params.value;
  // }
  changeValue() {
    console.log('changeValue : ', this.cellValue);
    this.activeParams.setValue(this.cellValue)
  }

}

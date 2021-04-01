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
  cellValue = null;
  activeParams;
  optionList = [{
    name: 'Accepted',
    value: true
  },
  //  {
  //   name: 'No',
  //   value: 'no'
  // }, 
  {
    name: 'Need Clarification',
    value: false
  }]
  constructor() { }

  ngOnInit() {
  }
  // gets called once before the renderer is used
  agInit(params): void {
    // this.cellValue = this.getValueToDisplay(params);
    console.log('agInit : ', params, params.data);
    this.activeParams = params;
    // this.cellValue = params && params.data ? params.data.Is_Read_By_Agent : null;
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
    // if (this.cellValue != null && this.cellValue=="true") {
    //   this.activeParams.setValue(JSON.parse(this.cellValue));
    // }
    // else{
    //   this.activeParams.setValue(JSON.parse(this.cellValue));
    // }
    switch (this.cellValue) {
      case true:
        this.activeParams.setValue(true);
        break;
      case false:
        this.activeParams.setValue(false);
        break;

      default:
        break;
    }
    console.log('changeValue : ', this.cellValue, this.activeParams.data);
  }

}

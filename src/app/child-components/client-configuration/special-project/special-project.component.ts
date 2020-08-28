import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Token } from '../../../manager/token';
import { ResponseHelper } from 'src/app/manager/response.helper';

@Component({
  selector: 'app-special-project',
  templateUrl: './special-project.component.html',
  styleUrls: ['./special-project.component.scss']
})
export class SpecialProjectComponent implements OnInit {
  @Input() ClientData;
  @Output() next_page = new EventEmitter<any>();
  Popup: boolean = false
  addSaag: FormGroup;
  token: Token;
  userData;
  rowData = [];
  ResponseHelper;
  addBtnDisable = false;
  columnDefs = [
    { headerName: 'ID', field: 'Id', hide: "false" },
    { headerName: 'Status', field: 'Status' },
    { headerName: 'SubStatus', field: 'Sub_Status' },
    { headerName: 'Action Code', field: 'Action_Code' },
    { headerName: 'Effectiveness Matrix', field: 'Effectiveness_Matrix' },
    // { headerName: 'Follow Up', field: 'Follow_Up', cellRenderer: this.ValCheck, width: 120 },
    // { headerName: 'Client Production', field: 'Client_Production', cellRenderer: this.ValCheck, width: 160, },
    // { headerName: 'Follow Up Days', field: 'Follow_Up_Days', width: 150 },
    // { headerName: 'Finding / Insights', field: 'Findings_Insights', width: 155 },
    // { headerName: 'Canned Notes', field: 'Canned_Notes', width: 130 },
    // {
    //   headerName: 'Active - Deactive', field: 'Is_Active', cellRenderer: this.MyCustomCellRendererClass,
    //   width: 150,

    // }
  ]
  gridApi;
  gridColumnApi;
  rowSelection = "single";
  constructor() { }

  ngOnInit() {
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.columnApi.autoSizeColumns();
  }
  nextPage() {
    this.next_page.emit('saag');
  }

  onCellClicked(event) {
  }
  navigate() { }
}

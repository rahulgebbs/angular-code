import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-concluder-report',
  templateUrl: './concluder-report.component.html',
  styleUrls: ['./concluder-report.component.scss']
})
export class ConcluderReportComponent implements OnInit {
  fromDate = new Date();
  maxDate = new Date();
  gridApi;
  gridColumnApi;
  rowData;
  columnDefs = [
    { headerName: 'ID', field: 'Id', hide: "false" },
    { headerName: 'Employee Code', field: 'Employee_Code' },
    { headerName: 'User Name', field: 'Username' },
    { headerName: 'Full Name', field: 'Full_Name' },
    { headerName: 'Email Id', field: 'Email_Id' },
    { headerName: 'Process', field: 'CommaSeparatedClients' },
    // { headerName: 'Role', field: 'Role' },
    // { headerName: 'Activate', field: 'Is_Deactivated', cellRenderer: this.isAcitvate },
    // { headerName: 'Locked', field: 'Is_Locked', cellRenderer: this.ValCheck },
    // { headerName: 'Terminated', field: 'Is_Terminated', cellRenderer: this.ValCheck },
    // { headerName: 'User Type', field: 'User_Type' },
    // { headerName: 'Expertise_In_Call', field: 'Expertise_In_Call', cellRenderer: this.ValCheck },
    // { headerName: 'Expertise_In_Website', field: 'Expertise_In_Website', cellRenderer: this.ValCheck },
    // { headerName: 'Expertise_In_Email', field: 'Expertise_In_Email', cellRenderer: this.ValCheck },
    // { headerName: 'Expertise_In_Fax', field: 'Expertise_In_Fax', cellRenderer: this.ValCheck },
    // { headerName: 'URL', field: 'URL', cellRenderer: this.ValCheck },
  ];
  rowSelection = "single";
  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
    this.rowData = [];
  }
  onGridReady(params) {
    // this.gridApi = params.api;
    // this.gridColumnApi = params.columnApi;
    // params.columnApi.autoSizeColumns();
  }
  autoSizeAll() {
    var allColumnIds = [];
    // this.gridColumnApi.getAllColumns().forEach(function (column) {
    //   allColumnIds.push(column.colId);
    // });
    // this.gridColumnApi.autoSizeColumns(allColumnIds);
  }
  onCellClicked(e) {}
}

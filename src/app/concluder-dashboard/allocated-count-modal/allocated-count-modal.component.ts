import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-allocated-count-modal',
  templateUrl: './allocated-count-modal.component.html',
  styleUrls: ['./allocated-count-modal.component.css']
})
export class AllocatedCountModalComponent implements OnInit {

  ShowModal = true
  @Input() AllocatedCountsData
  rowData;
  gridApi;
  gridColumnApi
  rowSelection = 'single'
  @Output() close = new EventEmitter<any>();


  columnDefs = [
    { headerName: 'Allocated to', field: 'Allocated_To' },
    { headerName: 'Allocated Count', field: 'Account_Count' }
  ];

  constructor() { }

  ngOnInit() {
    console.log('AllocatedCountsData : ', this.AllocatedCountsData);
    this.rowData = this.AllocatedCountsData;
    this.AllocatedCountsData.forEach(element => {
      element.Allocated_To = element.Allocated_To && element.Allocated_To.length > 0 ? element.Allocated_To : "N/A";
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // params.columnApi.autoSizeColumns();
    params.api.sizeColumnsToFit()
  }

  dismissModel() {
    this.close.emit();
  }

}

import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
// import { ColumnGroup } from 'ag-grid-community';
// import { parseIntAutoRadix } from '@angular/common/src/i18n/format_number';

@Component({
  selector: 'app-accounts-modal',
  templateUrl: './accounts-modal.component.html',
  styleUrls: ['./accounts-modal.component.css']
})
export class AccountsModalComponent implements OnInit {
  @Output() CloseAccountModal = new EventEmitter<any>();
  @Output() GetAllFields = new EventEmitter<any>();
  @Input() AccountsList;
  @Input() WorkingAccountId: number;
  RowSelection = "single";
  PayerName = '';
  columnDefs = [];
  GridApi;
  defaultColDef;
  CreateTemplate = '<b>hhhh</b>'
  newColumnList = [];
  constructor() { }

  ngOnInit() {
    this.defaultColDef = {
      cellRenderer: showOrderCellRenderer
    };
    this.setColumnList();
    function showOrderCellRenderer(params) {
      var eGui: any = document.createElement("span");
      eGui.innerHTML = `<span title='${params.value}'>${params.value}</span>`;
      return eGui;
    }
    this.PayerName = this.AccountsList[0].Group_By_Field_Header;
    console.log('this.PayerName : ', this.PayerName, this.AccountsList);
    this.AccountsList.forEach((e) => {
      if (!e.Completion_Date) {
        e.Completion_Date = "NULL";
      }
      else {
        var date: Date;
        date = new Date(e.Completion_Date);
        e.Completion_Date = + (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
      }
      e[this.PayerName] = e.Group_By_Field_Value;
    });

    this.columnDefs = [
      { field: 'Inventory_Id', hide: true, rowGroupIndex: null },
      { headerName: this.PayerName, field: this.PayerName },
      { headerName: 'TFL Status', field: 'TFL_Status' },
      { headerName: 'Days', field: 'Days' },
      { headerName: 'Amount ($)', field: 'Dollar_Value' },
      { headerName: 'V/N', field: 'Voice_NonVoice' },
      { headerName: 'Completion Date', field: 'Completion_Date' },
      { headerName: 'Encounter No', field: 'Encounter_Number' },
      //{ headerName: 'Account No', field: 'Account_Number' }
    ]
    if (this.AccountsList && this.AccountsList.length > 0 && this.AccountsList[0].Bucket_Name.indexOf('Appeal') != -1) {
      this.columnDefs.push({
        headerName: 'Action', field: 'Inventory_Id', field2: this.WorkingAccountId, cellRenderer: this.ActionDisable
      })
    }

    console.log('this.columnDefs : ', this.columnDefs);
    // this.AccountsList = JSON.parse(JSON.stringify(this.AccountsList));
    // this.columnDefs = JSON.parse(JSON.stringify(this.columnDefs));
  }
  Close() {
    this.CloseAccountModal.emit(false);
  }

  setColumnList() {
    console.log('setColumnList() : ', this.AccountsList);
    if (this.AccountsList[0] && this.AccountsList[0].Standard_Fields) {
      const { Standard_Fields } = this.AccountsList[0];
      Standard_Fields.forEach((element) => {
        this.columnDefs.push({ headerName: element.Header_Name, field: element.Header_Name });
      });
      this.AccountsList.forEach((account) => {
        account.Standard_Fields.forEach((field) => {
          account[field.Header_Name] = field.Field_Value;
        })
      })
    }
    console.log('this.columnDefs : ', this.columnDefs);
    this.AccountsList = JSON.parse(JSON.stringify(this.AccountsList));
    this.columnDefs = JSON.parse(JSON.stringify(this.columnDefs));
  }

  OnGridReady(event) {
    if (this.AccountsList != null) {
      var allColumnIds = [];
      event.columnApi.getAllColumns().forEach(function (column) {
        allColumnIds.push(column.colId);
      });
      event.columnApi.autoSizeColumns(allColumnIds);

      var thisref = this;
      event.api.forEachNode(function (node) {
        if (node.data.Inventory_Id == thisref.WorkingAccountId) {
          node.setSelected(true, true);
        }
      });
    }
  }



  ActionDisable(params) {
    if (params.value == params.colDef.field2) {

      var eDiv = document.createElement('div');
      eDiv.innerHTML = '<button disabled class="btn label blue label-info square-btn cursor">Start</button>'
      return eDiv;

    }
    else {

      var eDiv = document.createElement('div');
      eDiv.innerHTML = '<button  class="btn label blue label-info square-btn cursor">Start</button>'
      return eDiv;
    }
  }


  OnCellClicked(e) {
    if (e.event.target.localName == 'button') {
      this.GetFieldsFromAccount(e.data.Bucket_Name, e.data.Inventory_Id);
    }
  }

  OnRowClicked(e) {
    console.log('OnRowClicked : ', e.data)
    sessionStorage.removeItem('localPCN');
    sessionStorage.removeItem('lastPCN');
    this.GetFieldsFromAccount(e.data.Bucket_Name, e.data.Inventory_Id);
  }


  GetFieldsFromAccount(bucketname, inventoryid) {
    console.log('bucketname, inventoryid : ', bucketname, inventoryid)
    if (this.WorkingAccountId != inventoryid) {
      this.WorkingAccountId = inventoryid;
      sessionStorage.removeItem('localPCN');
      sessionStorage.removeItem('lastPCN');
      this.GetAllFields.emit({ Bucket_Name: bucketname, Inventory_Id: inventoryid });
    }
    else {
      this.CloseAccountModal.emit(false);
    }
  }
}

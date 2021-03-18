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
  gridApi;
  gridColumnApi;
  defaultColDef;
  CreateTemplate = '<b>hhhh</b>'
  newColumnList = [];
  savedFilterList = null;
  filterIsActive = null;
  activeFilters = 0;
  constructor() { }

  // onGridReady(params) {
  //   params.api.sizeColumnsToFit();
  //   this.gridApi = params.api;
  //   this.gridColumnApi = params.columnApi;
  //   console.log('this.gridApi,this.gridColumnApi: ', this.gridApi, this.gridColumnApi);
  // }

  ngOnInit() {
    this.defaultColDef = {
      cellRenderer: showOrderCellRenderer
    };

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
      { headerName: 'Account No', field: 'Account_Number' }
    ]
    this.setColumnList();
    if (this.AccountsList && this.AccountsList.length > 0 && this.AccountsList[0].Bucket_Name.indexOf('Appeal') != -1) {
      this.columnDefs.push({
        headerName: 'Action', field: 'Inventory_Id', field2: this.WorkingAccountId, cellRenderer: this.ActionDisable
      })
    }
    console.log('this.columnDefs : ', this.columnDefs);
  }
  Close() {
    this.checkFilter();
    console.log('Close() : ')
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
    console.log('OnGridReady : ', event)
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
    this.gridApi = event.api;
    this.gridColumnApi = event.columnApi;
    this.restoreFilterModel();
    // thisref.FilterChanged({});
    console.log('this.gridApi,this.gridColumnApi: ', this.gridApi, this.gridColumnApi);
  }

  checkFilter() {
    this.savedFilterList = this.gridApi.getFilterModel();

    if (this.savedFilterList == null || Object.keys(this.savedFilterList).length === 0) {
      sessionStorage.removeItem('agent-account-filter-list');
    }
    else {
      sessionStorage.setItem('agent-account-filter-list', JSON.stringify(this.savedFilterList));
    }
  }
  restoreFilterModel() {
    const filterListFromLocal = sessionStorage.getItem('agent-account-filter-list');
    if (filterListFromLocal && filterListFromLocal.length > 0) {
      this.gridApi.setFilterModel(JSON.parse(filterListFromLocal));
      this.gridApi.onFilterChanged();
    }
    this.FilterChanged(event)
  }

  checkIfFilterExists() {
    console.log('checkIfFilterExists() : ', this.gridApi.getFilterModel());
    return true;
  }

  resetFilter() {
    this.gridApi.setFilterModel([]);
    this.gridApi.onFilterChanged();
    this.checkFilter();

  }

  FilterChanged(event) {
    if (this.gridApi) {
      const modelList = this.gridApi.getFilterModel();
      if (modelList && Object.keys(modelList).length > 0) {
        this.filterIsActive = true;
        this.activeFilters = Object.keys(modelList).length;
      }
      else {
        this.filterIsActive = false;
        this.activeFilters = 0;
      }
      console.log('FilterChanged event : ', this.gridApi.getFilterModel(), event);
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
    this.checkFilter();
  }
}

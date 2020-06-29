import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { ConcluderService } from '../service/concluder.service';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-to-be-concluder-accounts',
  templateUrl: './to-be-concluder-accounts.component.html',
  styleUrls: ['./to-be-concluder-accounts.component.css']
})
export class ToBeConcluderAccountsComponent implements OnInit {

  @Output() CloseConcluderModal = new EventEmitter<any>();
  @Output() concluderRowClick = new EventEmitter<any>();
  AccountsList = null;
  @Input() WorkingAccountId: number;
  @Input() ClientId;
  @Input() UserId;
  RowSelection = "single";
  PayerName = '';
  columnDefs = [];
  GridApi;
  defaultColDef;

  CreateTemplate = '<b>hhhh</b>';
  ResponseHelper: ResponseHelper;
  allData = [];

  activeConcluderId = null;
  oldConcluderId = null;
  constructor(private concluderService: ConcluderService, private notificationservice: NotificationService) {
    this.ResponseHelper = new ResponseHelper(this.notificationservice);
  }

  ngOnInit() {
    console.log('toBeConcluded : ', this.UserId)
    this.toBeConcluded();
    this.oldConcluderId = this.WorkingAccountId;
  }

  toBeConcluded() {
    this.AccountsList = null;
    this.concluderService.checkIfConcluder(this.ClientId).subscribe((response) => {
      console.log('checkIfConcluder : ', response);
      if (response.Data == true) {
        this.concluderInventoryData();
      }
      else {
        this.AccountsList = [];
        this.concluderRowClick.emit({ Bucket_Name: "To_Be_Concluded", concluderId: null, AccountsList: this.AccountsList, fields: [], closePopup: false });
      }
      this.ResponseHelper.GetSuccessResponse(response);

    }, (error) => {
      console.log('checkIfConcluder error: ', error);
      this.ResponseHelper.GetFaliureResponse(error);
      // this.concluderInventoryData();
      this.AccountsList = [];
    });
  }
  Close() {
    this.CloseConcluderModal.emit(false);
  }

  concluderInventoryData() {
    console.log('concluderInventoryData() : ');
    this.concluderService.getConcluderInventoryData().subscribe((response) => {
      console.log('concluderInventoryData response : ', response);
      this.allData = response.Data;
      this.formatInventory();
      this.ResponseHelper.GetSuccessResponse(response);
    }, (error) => {
      console.log('concluderInventoryData error : ', error);
      this.ResponseHelper.GetFaliureResponse(error);
    })
  }

  formatInventory() {

    const list = [];
    this.allData.forEach((data) => {
      const obj = {};
      data.forEach((field) => {
        this.columnDefs.push({ headerName: field.Header_Name, field: field.Header_Name });
        obj[field.Header_Name] = field.Field_Value;
      });
      obj["Bucket_Name"] = "To_be_Concluded";
      list.push(obj)
    });
    this.columnDefs = _.uniqBy(this.columnDefs, (column) => {
      return column.headerName;
    });
    this.AccountsList = list;
    this.setFirstAccount(this.AccountsList[0], "To_be_Concluded");
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
        if (node.data.Concluder_Id == thisref.WorkingAccountId) {
          node.setSelected(true, true);
        }
      });
    }
  }

  setFirstAccount(account, Bucket_Name) {
    console.log('setFirstAccount : ', this.WorkingAccountId)
    if (account == null || account == undefined || this.WorkingAccountId != null) {
      return null;
    }
    const fieldList = this.allData && this.allData.length > 0 ? this.allData[0] : [];
    fieldList.forEach((field) => {
      if (field.Header_Name == 'Concluder_Id' || field.Header_Name == 'Bucket_Id' || field.Header_Name == 'Allocated_To' || field.Header_Name == 'Allocated_On') {
        field.Is_Standard_Field = false;
      }
      else {
        field.Is_Standard_Field = true;
      }
      // field['Column_DataType'] = fieldColumn_DataType
      field['Display_Name'] = field.Display_Name == null || field.Display_Name.length == 0 ? field.Header_Name : '';
      field['Is_View_Allowed_Agent'] = field.Is_View_Allowed_Agent == null ? true : false;
      field['FieldValue'] = field.FieldValue == null ? field.Field_Value : null;
    });
    this.insertConcluderTime(account.Concluder_Id);
    this.GetFieldsFromAccount(Bucket_Name, account.Concluder_Id, fieldList, false);
  }


  insertConcluderTime(concluderId) {
    const body = { Client_Id: this.ClientId, Concluder_Id: concluderId, User_Id: this.UserId };
    this.oldConcluderId = concluderId;
    this.concluderService.insertConcluderTime(body).subscribe((response) => {
      console.log('response : ', response);
    }, (error) => {
      console.log('error : ', error);
    })
  }

  updateConcluderTime(newConcluderId) {
    let body = { Client_Id: this.ClientId, Concluder_Id: this.oldConcluderId, User_Id: this.UserId };
    this.concluderService.updateConcluderTime(body).subscribe((response) => {
      console.log('response : ', response);
      // body.Concluder_Id = newConcluderId;
      this.insertConcluderTime(newConcluderId);
    }, (error) => {
      console.log('error : ', error);
    })
  }

  OnRowClicked(e) {
    // console.log('OnRowClicked : ', e);
    let standardFields = [];
    const fieldList = this.allData && this.allData.length > 0 ? this.allData[e.rowIndex] : [];
    fieldList.forEach((field) => {
      if (field.Header_Name == 'Concluder_Id' || field.Header_Name == 'Bucket_Id' || field.Header_Name == 'Allocated_To' || field.Header_Name == 'Allocated_On') {
        field.Is_Standard_Field = false;
      }
      else {
        field.Is_Standard_Field = true;
      }
      // field['Column_DataType'] = fieldColumn_DataType
      field['Display_Name'] = field.Display_Name == null || field.Display_Name.length == 0 ? field.Header_Name : '';
      field['Is_View_Allowed_Agent'] = field.Is_View_Allowed_Agent == null ? true : false;
      field['FieldValue'] = field.FieldValue == null ? field.Field_Value : null;
    });

    this.GetFieldsFromAccount(e.data.Bucket_Name, e.data.Concluder_Id, fieldList, true);
  }

  GetFieldsFromAccount(bucketname, concluderId, fieldList, closePopup) {
    sessionStorage.removeItem('localPCN');
    sessionStorage.removeItem('lastPCN');
    // console.log('bucketname, concluderId, fieldList, closePopup : ', bucketname, concluderId, fieldList, closePopup);
    console.log('final fieldList : ', fieldList);
    if (this.WorkingAccountId != concluderId) {
      this.WorkingAccountId = concluderId;
      if (closePopup == true) {
        this.updateConcluderTime(concluderId);
      }
      this.concluderRowClick.emit({ Bucket_Name: bucketname, concluderId: concluderId, AccountsList: this.AccountsList, fields: fieldList, closePopup: closePopup });
      this.saveIntoLocal();
    }
    else {
      if (closePopup == true)
        this.CloseConcluderModal.emit(closePopup);
    }
  }
  saveIntoLocal() {
    sessionStorage.setItem('concluderAccounts', JSON.stringify(this.allData));
  }
}

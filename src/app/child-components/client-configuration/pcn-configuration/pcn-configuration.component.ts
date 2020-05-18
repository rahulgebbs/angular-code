import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SaagService } from '../../../service/client-configuration/saag.service';
import { Token } from '../../../manager/token';
import { NotificationService } from 'src/app/service/notification.service';
import * as FileSaver from 'file-saver';
import { Router } from '@angular/router';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { ExcelService } from 'src/app/service/client-configuration/excel.service';
import { customValidation } from 'src/app/manager/customValidators';
// import { dropDownFields } from 'src/app/manager/dropdown-feilds';
import { PcnService } from 'src/app/service/pcn.service';
@Component({
  selector: 'app-pcn-configuration',
  templateUrl: './pcn-configuration.component.html',
  styleUrls: ['./pcn-configuration.component.css'],
  // providers: [ExcelService, dropDownFields]

})
export class PcnConfigurationComponent implements OnInit {
  token: Token;
  userData;
  rowData;
  ResponseHelper;
  disableSave: boolean = false
  addBtnDisable;
  showPopup;
  @Input() ClientData;
  @Output() next_page = new EventEmitter<any>();
  columnDefs = [];
  gridApi;
  gridColumnApi;
  rowSelection = "single";
  constructor(private router: Router, private notificationservice: NotificationService, private pcnService: PcnService) {
    this.token = new Token(this.router);
    this.userData = this.token.GetUserData();
  }

  CreateSaagForm() {

  }

  ngOnInit() {
    this.getPCNList();
    this.ResponseHelper = new ResponseHelper(this.notificationservice);

    this.columnDefs = [
      { headerName: 'Display Header', field: 'Display_Header', editable: true },
      { headerName: 'Field Limit', field: 'Field_Limit', editable: true },
      {
        field: "Column_Data_Type",
        headerName: "Column Data Type",
        editable: true
      }];
  }
  nextPage() {
    this.next_page.emit('pcn');
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.columnApi.autoSizeColumns();
  }

  navigate() {
    this.next_page.emit('pcn');
  }

  getPCNList() {
    console.log('getPCNList() :', this.ClientData);
    this.rowData = null;
    this.pcnService.getPCNList(this.ClientData.Id).subscribe((response: any) => {
      console.log('response : ', response.Data);
      this.rowData = response.Data
    }, (error) => {
      this.rowData = [];
      console.log('error : ', error)
    });
  }

  openPopup() {
    this.showPopup = true;
  }
  closePopup(event) {
    console.log('closePopup(event) : ', event)
    this.showPopup = false;
  }
  saveFields(value) {
    console.log('pcn value : ', value);
    this.rowData = this.rowData ? this.rowData : []
    this.rowData.push(value);
    this.rowData = JSON.parse(JSON.stringify(this.rowData));
    console.log('this.rowData : ', this.rowData);
    this.showPopup = false;
  }

  submit() {
    console.log('submit() : ', this.rowData);
    // this.next_page.emit('pcn');
    const obj = {
      "Client_Id": this.ClientData.Id,
      "Client_PCN_Configuration_List": this.rowData
    }
    this.pcnService.updatePCNList(obj).subscribe((response) => {
      console.log('response :', response)
    }, (error) => {
      console.log('error :', error)
    })
  }
  removeItem(i) {
    this.rowData.splice(i, 1)
  }
}

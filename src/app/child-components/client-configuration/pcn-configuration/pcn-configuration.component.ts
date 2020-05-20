import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';


import { Token } from '../../../manager/token';
import { NotificationService } from 'src/app/service/notification.service';
import * as FileSaver from 'file-saver';
import { Router } from '@angular/router';
import { ResponseHelper } from 'src/app/manager/response.helper';
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
  // columnDefs = [];
  // gridApi;
  // gridColumnApi;
  // rowSelection = "single";
  addPCNForm;
  pcnList: any;
  // constructor(private fb: FormBuilder) { }
  constructor(private router: Router, private notificationservice: NotificationService, private pcnService: PcnService, private fb: FormBuilder) {
    this.token = new Token(this.router);
    this.userData = this.token.GetUserData();
  }

  CreateSaagForm() {

  }

  ngOnInit() {
    this.initForm();
    this.getPCNList();
    this.ResponseHelper = new ResponseHelper(this.notificationservice);
  }
  nextPage() {
    this.next_page.emit('pcn');
  }
  onGridReady(params) {
    // this.gridApi = params.api;
    // this.gridColumnApi = params.columnApi;
    // params.columnApi.autoSizeColumns();
  }

  navigate() {
    this.next_page.emit('pcn');
  }

  initForm() {
    this.addPCNForm = this.fb.group({
      pcnList: this.fb.array([])
    });
  }
  createItem(pcn) {
    // console.log('addPCNForm : ', this.addPCNForm);
    return this.fb.group({
      "Display_Header": [pcn.Display_Header, Validators.required],
      "Column_Data_Type": [pcn.Column_Data_Type, Validators.required],
      "Field_Limit": [pcn.Field_Limit, [Validators.required, Validators.pattern(/^(\d|,)*\d*$/)]]
    });
  }

  addItem(pcn, index): void {
    this.pcnList = this.addPCNForm.get('pcnList') as FormArray;
    index = index >= 0 ? index : 0
    this.pcnList.push(this.createItem(pcn));
    setTimeout(() => {
      this.makeFieldsDirty();
    }, 100);
    // console.log('this.pcnList : ', this.pcnList);
    // const lastIndex = this.pcnList.length - 1;
    // setTimeout(() => {
    // this.checkIfAlreadyExist(this.pcnList.controls[lastIndex].controls.Display_Header, lastIndex);
    // }, 100);

  }

  getPCNList() {
    console.log('getPCNList() :', this.ClientData);
    this.rowData = null;
    this.pcnService.getPCNList(this.ClientData.Id).subscribe((response: any) => {
      console.log('response : ', response.Data);
      this.rowData = response.Data;
      this.setFormFields();
    }, (error) => {
      this.rowData = [];
      console.log('error : ', error)
    });
  }

  setFormFields() {
    this.rowData.forEach((pcn, index) => {
      this.addItem(pcn, index - 1)
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
    if (value) {
      this.addItem(value, this.pcnList.length - 1);
    }
    this.showPopup = false;
    // this.rowData = this.rowData ? this.rowData : []
    // this.rowData.push(value);
    // this.rowData = JSON.parse(JSON.stringify(this.rowData));
    // console.log('this.rowData : ', this.rowData);
    // this.showPopup = false;
  }

  submit() {
    console.log('submit() : ', this.rowData);
    // this.next_page.emit('pcn');
    if (this.addPCNForm && !this.addPCNForm.valid) {
      return false;
    }
    const obj = {
      "Client_Id": this.ClientData.Id,
      "Client_PCN_Configuration_List": this.addPCNForm.value.pcnList
    }
    this.pcnService.updatePCNList(obj).subscribe((response) => {
      console.log('response :', response)
      this.ResponseHelper.GetSuccessResponse(response);
    }, (error) => {
      console.log('error :', error);
      this.ResponseHelper.GetFaliureResponse(error);
    })
  }

  checkIfAlreadyExist(field, fieldIndex) {
    const pcnList = this.addPCNForm.value.pcnList;
    if (field.value && field.value.length > 0)
      field.setErrors(null);
    pcnList.find((element, index) => {
      console.log('checkIfAlreadyExist : ', field.value, fieldIndex, element.Display_Header, index);

      if (field.value.length > 0 && fieldIndex != index && fieldIndex > index && field.value == element.Display_Header) {
        console.log('matched : ', field.value, fieldIndex, element.Display_Header, index)
        field.setErrors({ 'incorrect': true });
        field.markAsDirty();
      }
    });
  }
  removeItem(i) {
    // this.rowData.splice(i, 1);
    this.pcnList.removeAt(i);
    setTimeout(() => {
      this.makeFieldsDirty();
    }, 100);
  }

  makeFieldsDirty() {
    this.pcnList = this.addPCNForm.get('pcnList') as FormArray;
    this.pcnList.controls.forEach((field, index) => {
      this.checkIfAlreadyExist(field.controls.Display_Header, index);
    })
  }
}

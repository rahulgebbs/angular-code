import { Component, OnInit, HostListener, ChangeDetectorRef, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Token } from 'src/app/manager/token';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
import { ConcluderService } from '../service/concluder.service';
import { customValidation } from '../manager/customValidators';
import * as moment from 'moment';
// import { MomentDateTimeAdapter } from 'ng-pick-datetime-moment';

@Component({
  selector: 'app-agent-concluder',
  templateUrl: './agent-concluder.component.html',
  styleUrls: ['./agent-concluder.component.css']
})
export class AgentConcluderComponent implements OnInit, OnChanges {
  ResponseHelper: ResponseHelper;
  userData;
  concludedForm: FormGroup
  token: Token;
  Title = 'User Menu Mapping';
  statusList = [];
  @Input() ClientId;
  @Input() concluderId;
  @Output() assignInventory = new EventEmitter<any>();
  @Input() Employee_Code;
  @Input() UserId;
  submitStatus = false;
  disableBtn = false;
  constructor(
    private router: Router,
    private notificationservice: NotificationService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private concluderService: ConcluderService
  ) {
    this.ResponseHelper = new ResponseHelper(this.notificationservice);
  }

  ngOnInit() {
    // console.log('ngOnInit() AgentConcluderComponent : ');
    // if (this.ClientId != null) {
    //   this.initForm();
    // }
    // this.getStatusDropdownList();
    // this.setFields();
  }

  ngOnChanges(changes) {
    console.log('ngOnChanges : ', this.ClientId, this.concluderId, changes);
    this.submitStatus = false;
    if (this.ClientId != null && this.concluderId != null) {
      this.initForm();
    }

  }

  setFields() {
    this.concludedForm.patchValue({ 'Client_Id': this.ClientId, 'Concluder_Id': this.concluderId });
    console.log('setFields', this.concludedForm.value);
    // const Concluder_Id = this.
  }
  changeBillDate(event) {
    // console.log('changeBillDate event : ', this.concludedForm);
    // const { value } = this.concludedForm;
    // if (value.Original_Claim_Billed_Date != null && value.Latest_Claim_Billed_Date != null) {
    //   var startDate = moment(value.Latest_Claim_Billed_Date, 'MM/DD/YYYY');
    //   var endDate = moment(value.Original_Claim_Billed_Date, 'MM/DD/YYYY');
    //   var result = Number(endDate.diff(startDate, 'days'));
    //   console.log('result : ', result);
    //   if (result > 0) {
    //     // this.concludedForm.controls.Original_Claim_Billed_Date.setErrors({ invalidDate: true });
    //   }
    //   else {
    //     // this.concludedForm.controls.Original_Claim_Billed_Date.setErrors(null);
    //   }
    // }
    // else {
    //   // this.concludedForm.controls.Original_Claim_Billed_Date.setErrors(null);
    // }
    // console.log('changeBillDate event : ', this.concludedForm.controls.Original_Claim_Billed_Date.errors);
  }

  initForm() {
    const self = this;
    this.concludedForm = this.fb.group({
      "Client_Id": [null],
      "Concluder_Id": [null],
      "Original_Claim_Billed_Date": [null, Validators.required],
      "Latest_Claim_Billed_Date": [null, Validators.required],
      "Provider": [null],
      "Rejection": [null, Validators.required],
      "Rejection_Reason": [null, Validators.required],
      "EOB_Available": [false],
      "Status": [null],
      "EOB_Posted_in_Sys": [false],
      "Denial_1": [null],
      "Denial_2": [null],
      "Denial_3": [null],
      "Denial_4": [null],
      "Denial_5": [null],
      "Denial_Reason": [null],
      "Remarks": [null],
      "Denial_Date": [null],
      "Employee_Code": [null],
      "Concluded": [null]
    });
    this.getStatusDropdownList();
    this.setFields();

    this.concludedForm.patchValue({ Employee_Code: this.Employee_Code });
  }

  clearForm() {
    this.initForm();
    console.log('clearForm() : ', this.concludedForm);
  }

  BlockInput(field, event) {
    console.log('BlockInput event : ', event)
    const fieldCtrl = this.concludedForm.controls[`${field}`];
    // console.log('BlockInput : ', fieldCtrl.value, fieldCtrl.errors);
    // console.log('BlockInput event, event.value, event.target : ', event, event.value, event.target);
    if (fieldCtrl && fieldCtrl.value != null && event != null && event.target != null) {
      this.setDateError(fieldCtrl, event.target.value);
      // return false;
    }
    else {
      if (event && event.value) {
        const date = moment(event.value).format('MM/DD/YYYY');
        this.setDateError(fieldCtrl, date);
      }
      else {
        fieldCtrl.setErrors({ 'invalidDate': true });
      }
    }
    // console.log('BlockInput : ', fieldCtrl.value, event);
    this.cdr.detectChanges();
  }

  setDateError(fieldCtrl, value) {
    console.log('setDateError fieldCtrl : ', fieldCtrl.errors, value);
    const { errors } = fieldCtrl;
    const dateStatus = this.isGoodDate(fieldCtrl.value, value);
    // console.log('dateStatus :')
    if (dateStatus == false) {
      fieldCtrl.setErrors({ 'dateFormat': true });
    }
    else {
      if (errors == null || (errors.dateFormat == null && errors.invalidDate == null && errors.owlDateTimeMax == null)) {
        fieldCtrl.setErrors(null);
      }
    }
    var newDate = moment(value).format("MM/DD/YYYY");
    // var validdate = moment(newDate, "MM/DD/YYYY");
    // const newStr = value.replace(/-/g, "/")
    // value
    // console.log('newDate != value : ', newDate != value)
    if (newDate != value) {
      fieldCtrl.setErrors({ 'invalidDate': true });
    }

    console.log('fieldCtrl.value : ', value, newDate);
    // console.log('dateStatus : ', dateStatus);
  }
  isGoodDate(date, value) {
    // console.log('isGoodDate : ', date)
    var regexp = /^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/;
    // console.log('date.length :', date.getMonth(), date.getDate(), date.getFullYear());
    if (value && (value.length < 8 || value.length > 10)) {
      return false;
    }
    // console.log("moment(date).format('MM/DD/YYYY') : ", moment(date).format('MM/DD/YYYY'));
    return regexp.test(moment(date).format('MM/DD/YYYY'));
  }
  handleRejection() {
    console.log('handleRejection : ', this.concludedForm);
    let form = this.concludedForm;
    let Rejection = form.get('Rejection').value;
    let EOB_Available = form.get('EOB_Available');
    let Rejection_Reason = form.get('Rejection_Reason');
    form.patchValue({ EOB_Available: null });
    form.patchValue({ Rejection_Reason: null });
    if (Rejection != null && Rejection == false) {
      EOB_Available.setValidators(Validators.required);
      Rejection_Reason.setValidators(null);
      Rejection_Reason.setErrors(null)
      // form.patchValue({ EOB_Available: null, Rejection_Reason: null });
      form.patchValue({ Status: null, EOB_Posted_in_Sys: null, Denial_Reason: null, Denial_Date: null, EOB_Available: null, Rejection_Reason: null, Denial_1: null });
    }
    else {
      EOB_Available.setValidators(null);
      EOB_Available.setErrors(null);
      Rejection_Reason.setValidators(Validators.required);
      form.patchValue({ EOB_Posted_in_Sys: null, EOB_Available: null });
    }
  }

  handleEOBAvailabe() {
    console.log('handleEOBAvailabe : ', this.concludedForm);
    let form = this.concludedForm;

    let EOB_Available = form.get('EOB_Available');
    let Status = form.get('Status');
    let EOB_Posted_in_Sys = form.get('EOB_Posted_in_Sys');
    let Denial_Reason = form.get('Denial_Reason');
    let Denial_Date = form.get('Denial_Date');
    let primary_denial = form.get('Denial_1');
    if (EOB_Available.value == true) {
      Status.setValidators(Validators.required);
      EOB_Posted_in_Sys.setValidators(Validators.required);
      Denial_Reason.setValidators(Validators.required);
      Denial_Date.setValidators(Validators.required);
    }
    else {
      Status.setValidators(null);
      EOB_Posted_in_Sys.setValidators(null);
      Denial_Reason.setValidators(null);
      Denial_Date.setValidators(null);
      primary_denial.setValidators(null);
      Status.setErrors(null);
      EOB_Posted_in_Sys.setErrors(null);
      Denial_Reason.setErrors(null);
      Denial_Date.setErrors(null);
      primary_denial.setErrors(null);

      form.patchValue({ Status: null, Denial_Reason: null, Denial_Date: null, Denial_1: null });
      form.patchValue({ EOB_Posted_in_Sys: null, EOB_Available: false });
    }
    form.updateValueAndValidity();
  }

  handleStatus() {
    let form = this.concludedForm;
    console.log('handleStatus form : ', form);
    let Status = form.get('Status');
    let Denial_Reason = form.get('Denial_Reason');
    let Denial_Date = form.get('Denial_Date');
    let primary_denial = form.get('Denial_1');
    if (Status.value == 'Paid') {
      Denial_Reason.setValidators(null);
      Denial_Date.setValidators(null);
      primary_denial.setValidators(null);
      Denial_Reason.setErrors(null);
      Denial_Date.setErrors(null);
      primary_denial.setErrors(null);
      form.patchValue({ Denial_Reason: null, Denial_Date: null, Denial_1: null });
    }
    else if (Status.value == 'Denied' || Status.value == 'Partially Denied') {
      Denial_Reason.setValidators(Validators.required);
      Denial_Date.setValidators(Validators.required);
      primary_denial.setValidators(Validators.required);
    }
    else {

    }

  }

  submitForm() {
    console.log('submitForm() : ', this.concludedForm);
    // const form = this.concludedForm;
    this.submitStatus = true;
    const value = this.concludedForm.value;
    if (this.concludedForm.valid == true) {
      this.disableBtn = true;
      // "Original_Claim_Billed_Date": [null, Validators.required],
      // "Latest_Claim_Billed_Date": [null, Validators.required],
      if (this.concludedForm.value['EOB_Available'] == null) {
        this.concludedForm.patchValue({ EOB_Available: false });
      }
      if (this.concludedForm.value['EOB_Posted_in_Sys'] == null) {
        this.concludedForm.patchValue({ EOB_Posted_in_Sys: false });
      }
      if (this.concludedForm.value['Denial_Date'] == null) {
        this.concludedForm.patchValue({ Denial_Date: "01/01/1990" });
      }
      else {
        this.concludedForm.patchValue({ Denial_Date: moment(value['Denial_Date']).utcOffset(0, true).format() });
      }
      value['Original_Claim_Billed_Date'] = moment(value['Original_Claim_Billed_Date']).utcOffset(0, true).format();
      value['Latest_Claim_Billed_Date'] = moment(value['Latest_Claim_Billed_Date']).utcOffset(0, true).format();
      this.concludedForm.patchValue({ Original_Claim_Billed_Date: value['Original_Claim_Billed_Date'], Latest_Claim_Billed_Date: value['Latest_Claim_Billed_Date'] });
      this.concluderService.submitToBeConcludedForm(this.concludedForm.value).subscribe((response) => {
        console.log('submitToBeConcludedForm response : ', response);
        this.assignNextInventory(this.concludedForm.value['Concluder_Id']);
        this.ResponseHelper.GetSuccessResponse(response);
        this.submitStatus = false;
        this.disableBtn = false;
      }, (error) => {
        console.log('submitToBeConcludedForm error : ', error);
        this.ResponseHelper.GetFaliureResponse(error);
        this.submitStatus = false;
        this.disableBtn = false;
      });
    }
  }

  updateConcluderTime(oldConcluderId, obj) {
    let body = { Client_Id: this.ClientId, Concluder_Id: oldConcluderId, User_Id: this.UserId };
    this.concluderService.updateConcluderTime(body).subscribe((response) => {
      console.log('response : ', response);
      // body.Concluder_Id = newConcluderId;
      this.insertConcluderTime(obj);
      //this.assignInventory.emit
    }, (error) => {
      console.log('error : ', error);
    })
  }
  insertConcluderTime(obj) {
    const body = { Client_Id: this.ClientId, Concluder_Id: obj.concluderId, User_Id: this.UserId };
    // this.oldConcluderId = concluderId;
    if (obj && obj.concluderId == null) {
      this.assignInventory.emit(obj);
      return null;
    }
    this.concluderService.insertConcluderTime(body).subscribe((response) => {
      console.log('response : ', response);
      this.assignInventory.emit(obj);
    }, (error) => {
      console.log('error : ', error);
      this.assignInventory.emit(obj);
    })
  }
  getStatusDropdownList() {
    console.log('getStatusDropdownList : ');
    this.concluderService.getDropDownStatus(this.ClientId).subscribe((response: any) => {
      console.log('getStatusDropdownList response : ', response);
      this.statusList = response.Data;
      this.ResponseHelper.GetSuccessResponse(response);
    }, (error) => {
      console.log('error : ', error)
      this.ResponseHelper.GetFaliureResponse(error);
    })
  }

  assignNextInventory(Old_Concluder_Id) {
    const localStr = sessionStorage.getItem('concluderAccounts');//JSON.parse(sessionStorage.getItem('concluderAccounts'));
    let fieldList = [];
    if (localStr != null) {
      var concluderAccouts = JSON.parse(localStr);
      concluderAccouts.forEach((list, listIndex) => {
        // console.log('list : ', list)
        list.forEach((field, index) => {
          console.log('assignNextInventory field : ', field);

          if (field.Header_Name == 'Concluder_Id' && this.concluderId == field.FieldValue) {
            fieldList = list;
            concluderAccouts.splice(listIndex, 1);
            return false;
          }
        });
      });
    }
    if (concluderAccouts && concluderAccouts.length > 0) {
      concluderAccouts[0].forEach((field) => {
        if (field.Header_Name == 'Concluder_Id' || field.Header_Name == 'Bucket_Id' || field.Header_Name == 'Allocated_To' || field.Header_Name == 'Allocated_On') {
          field.Is_Standard_Field = false;
        }
        else {
          field.Is_Standard_Field = true;
        }
        field['Display_Name'] = field.Header_Name;
        field['Is_View_Allowed_Agent'] = true;
        field['FieldValue'] = field.Field_Value;
      });
      const matchedObj = concluderAccouts[0].find((ele) => {
        return ele.Header_Name == "Concluder_Id";
      });
      this.updateConcluderTime(Old_Concluder_Id, { Bucket_Name: "To_be_Concluded", concluderId: matchedObj.FieldValue, fields: concluderAccouts[0], closePopup: false });
      //this.assignInventory.emit({ Bucket_Name: "To_be_Concluded", concluderId: matchedObj.FieldValue, fields: concluderAccouts[0], closePopup: false });
    }
    else {
      this.updateConcluderTime(Old_Concluder_Id, { Bucket_Name: "To_be_Concluded", concluderId: null, fields: [], closePopup: false });
      //this.assignInventory.emit({ Bucket_Name: "To_be_Concluded", concluderId: null, fields: [], closePopup: false });
    }
    sessionStorage.setItem('concluderAccounts', JSON.stringify(concluderAccouts));
    // this.concluderRowClick.emit({ Bucket_Name: bucketname, concluderId: concluderId, AccountsList: this.AccountsList, fields: fieldList, closePopup: closePopup });
  }
}

import { Component, OnInit, HostListener, ChangeDetectorRef, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Token } from 'src/app/manager/token';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
import { ConcluderService } from '../service/concluder.service';
import { customValidation } from '../manager/customValidators';
import * as moment from 'moment';
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
    console.log('ngOnInit() AgentConcluderComponent : ');
    // if (this.ClientId != null) {
    //   this.initForm();
    // }
    // this.getStatusDropdownList();
    // this.setFields();
  }

  ngOnChanges(changes) {
    console.log('ngOnChanges AgentConcluderComponent : ', changes)
    if (this.ClientId != null) {
      this.initForm();
    }

  }

  setFields() {
    this.concludedForm.patchValue({ 'Client_Id': this.ClientId, 'Concluder_Id': this.concluderId });
    // const Concluder_Id = this.
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
      "Conclusion": [null]
    });
    this.getStatusDropdownList();
    this.setFields();

    this.concludedForm.patchValue({ Employee_Code: this.Employee_Code });
  }

  clearForm() {
    this.initForm();
    console.log('clearForm() : ', this.concludedForm);
  }

  BlockInput(event) {
    if (event.key == 'Tab') {
      // if (event.key == 'Backspace' || event.key == 'Tab') {
      return true;
    }
    else {
      return false;
    }
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
      form.patchValue({ Status: null, EOB_Posted_in_Sys: false, Denial_Reason: null, Denial_Date: null, EOB_Available: false, Rejection_Reason: null });
    }
    else {
      EOB_Available.setValidators(null);
      EOB_Available.setErrors(null);
      Rejection_Reason.setValidators(Validators.required);
      form.patchValue({ EOB_Posted_in_Sys: false, EOB_Available: false });
    }
  }

  handleEOBAvailabe() {
    console.log('handleRejection : ', this.concludedForm);
    let form = this.concludedForm;

    let EOB_Available = form.get('EOB_Available');
    let Status = form.get('Status');
    let EOB_Posted_in_Sys = form.get('EOB_Posted_in_Sys');
    let Denial_Reason = form.get('Denial_Reason');
    let Denial_Date = form.get('Denial_Date');

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

      Status.setErrors(null);
      EOB_Posted_in_Sys.setErrors(null);
      Denial_Reason.setErrors(null);
      Denial_Date.setErrors(null);
      form.patchValue({ Status: null, Denial_Reason: null, Denial_Date: null });
      // form.patchValue({ Status: null, EOB_Posted_in_Sys: null, Denial_Reason: null, Denial_Date: null });
      form.patchValue({ EOB_Posted_in_Sys: false, EOB_Available: false });
    }

    form.updateValueAndValidity();
  }

  handleStatus() {
    let form = this.concludedForm;
    console.log('form : ', form);
    let Status = form.get('Status');
    let Denial_Reason = form.get('Denial_Reason');
    let Denial_Date = form.get('Denial_Date');
    if (Status.value == 'Paid') {
      Denial_Reason.setValidators(null);
      Denial_Date.setValidators(null);
      Denial_Reason.setErrors(null);
      Denial_Date.setErrors(null);
      form.patchValue({ Denial_Reason: null, Denial_Date: null });
    }
    if (Status.value == 'Denied' || Status.value == 'Partially Denied') {
      Denial_Reason.setValidators(Validators.required);
      Denial_Date.setValidators(Validators.required);
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
        this.assignNextInventory();
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

  assignNextInventory() {
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
      this.assignInventory.emit({ Bucket_Name: "To Be Concluded", concluderId: matchedObj.FieldValue, fields: concluderAccouts[0], closePopup: false });
    }
    else {
      this.assignInventory.emit({ Bucket_Name: "To Be Concluded", concluderId: null, fields: [], closePopup: false });
    }
    sessionStorage.setItem('concluderAccounts', JSON.stringify(concluderAccouts));
    // this.concluderRowClick.emit({ Bucket_Name: bucketname, concluderId: concluderId, AccountsList: this.AccountsList, fields: fieldList, closePopup: closePopup });
  }
}

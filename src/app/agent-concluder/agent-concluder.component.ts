import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { Token } from 'src/app/manager/token';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
@Component({
  selector: 'app-agent-concluder',
  templateUrl: './agent-concluder.component.html',
  styleUrls: ['./agent-concluder.component.css']
})
export class AgentConcluderComponent implements OnInit {
  ResponseHelper: ResponseHelper;
  userData;
  concludedForm: FormGroup
  token: Token;
  Title = 'User Menu Mapping';
  constructor(
    private router: Router,
    private notification: NotificationService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.initForm()
  }



  initForm() {
    this.concludedForm = this.fb.group({
      "Id": [0], "Client_Id": [null],
      "Concluder_Id": [null],
      "Original_Claim_Billed_Date": [null],
      "Latest_Claim_Billed_Date": [null],
      "Provider": [null],
      "Rejection": [null],
      "Rejection_Reason": [null],
      "EOB_Available": [true],
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
    })
    // SAMPLE CODE
    /*
    {"Id":0,"Client_Id":9064,"Concluder_Id":3,"Original_Claim_Billed_Date":"07/06/2010","Latest_Claim_Billed_Date":"08/06/2010","Provider":"abc","Rejection":"false","Rejection_Reason":"","EOB_Available":true,"Status":"Denied","EOB_Posted_in_Sys":"false","Denial_1":"CO147","Denial_2":"B11","Denial_3":"003","Denial_4":"004","Denial_5":"005","Denial_Reason":"Rejections","Remarks":"fail","Denial_Date":"09/06/2010","Employee_Code":"5000","Conclusion":""}
    */
  }

  submitForm() {
    console.log('submitForm() : ', this.concludedForm.value)
  }
}

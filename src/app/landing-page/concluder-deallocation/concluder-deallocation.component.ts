import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Token } from 'src/app/manager/token';
import { dropDownFields } from 'src/app/manager/dropdown-feilds';
import { DeallocationByAgentByBucketService } from 'src/app/service/deallocation-by-agent-by-bucket.service';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
import { ConcluderService } from 'src/app/service/concluder.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-concluder-deallocation',
  templateUrl: './concluder-deallocation.component.html',
  styleUrls: ['./concluder-deallocation.component.css'],
  providers: [dropDownFields]
})
export class ConcluderDeallocationComponent implements OnInit {

  title = "Concluder De-Allocation";
  AgentdeallocationForm: FormGroup;
  ClientList: any[] = [];
  userdata;
  UserId: number;
  ClientId = "";
  showOptionButtons: boolean = false;
  ShowAgentModal: boolean = false;
  ShowBucketModal: boolean = false;
  // BucketName = [];
  ResponseHelper: ResponseHelper;
  checkevent: boolean = false;
  validated;
  bucketList;
  employeeList;
  byBucketInfo;
  byAgentInfo;
  // empName = [];
  // GetEmployeeName;
  // AllBucketByempList;
  // checklist = "";
  // showModal = false;
  constructor(public fb: FormBuilder, private router: Router, private drpService: dropDownFields, private DeallocationService: DeallocationByAgentByBucketService, private notification: NotificationService, private concluderService: ConcluderService) {
    this.ResponseHelper = new ResponseHelper(this.notification);

  }
  ngOnInit() {
    let token = new Token(this.router);
    this.AgentdeallocationForm = this.fb.group({
      "ClientId": [],
      "checklist": []
    });
    this.userdata = token.GetUserData();
    this.UserId = this.userdata.UserId;
    //this.ClientList = this.drpService.setSelected(this.userdata.Clients)
    this.ClientList = this.setSelectedDropdown(this.userdata.Clients);
    // console.log('this.ClientList : ', this.ClientList);
    if (this.ClientList[0].selected == true) {
      this.showOptionButtons = true;
      // this.ClientId = this.ClientList[0].Client_Id
      this.AgentdeallocationForm.patchValue({ 'ClientId': this.ClientList[0].Client_Id });
      // this.ClientSelectDropdown(event)
      this.ClientListOnChange(this.AgentdeallocationForm.value.ClientId);
    }
    //this.selectedValue(this.ClientList);
  }

  submitFrom() {
    this.AgentdeallocationForm.reset();
  }

  //to display option button
  ClientListOnChange(event) {
    const { ClientId } = this.AgentdeallocationForm.value;
    console.log('ClientListOnChange : ', ClientId);
    this.showOptionButtons = true;
    if (ClientId) {
      // this.ClientId = event.target.value;
      this.GetBucketNames(ClientId);
      this.GetEmpNames(ClientId);
    }
  }

  GetBucketNames(ClientId) {
    this.bucketList = [];
    this.employeeList = [];
    this.concluderService.getBucketsByEmployee(ClientId).subscribe(
      res => {
        console.log('GetBucketNames res : ', res);
        this.byBucketInfo = res.Data;
      },
      err => {
        this.bucketList = [];
        this.employeeList = [];
        console.log('GetBucketNames err : ', err);
        this.ResponseHelper.GetFaliureResponse(err)
      }
    )
  }

  GetEmpNames(ClientId) {
    // this.GetEmployeeName = [];
    this.bucketList = [];
    this.employeeList = [];
    this.concluderService.getEmployeesByBucket(ClientId).subscribe(
      res => {
        console.log('getEmployeesByBucket res : ', res);
        this.byAgentInfo = res.Data;
      },
      err => {
        this.bucketList = [];
        this.employeeList = [];
        this.ResponseHelper.GetFaliureResponse(err);
        console.log('getEmployeesByBucket err : ', err);
      }
    )
  }
  //display model

  OpenByBucket(event) {
    //this.GetBucketNames();
    // this.ShowBucketModal = true;
    // this.bucketList = JSON.parse(JSON.stringify(this.bucketList));
    this.bucketList = this.byBucketInfo.BucketName_By_Emp_Info;
    this.employeeList = this.byBucketInfo.Emp_Info;
    console.log('by bucket : ', this.byBucketInfo);
    // const { ClientId } = this.AgentdeallocationForm.value;
    // this.GetBucketNames(ClientId)
  }
  OpenByAgent(event) {
    this.bucketList = this.byAgentInfo.buckets;
    this.employeeList = this.byAgentInfo.employees //_.uniqBy(this.byAgentInfo.employees, 'User_Id');
    console.log('by agent : ', this.byAgentInfo);
  }
  //close Modal
  CloseBucketModal() {
    this.ShowBucketModal = false;
    // this.ClientId = "";
    this.AgentdeallocationForm.patchValue({ ClientId: null })
    // this.checklist = "";
    this.showOptionButtons = false;
  }
  CloseAgentModal() {
    this.ShowAgentModal = false;
    // this.ClientId = "";
    this.AgentdeallocationForm.patchValue({ ClientId: null });
    // this.checklist = "";
    this.showOptionButtons = false;
  }
  BucketValid() {
    this.checkevent = true
    this.validated = true
  }

  setSelectedDropdown(data) {
    if (data && data.length > 1) {
      data[0].selected = false
      return data
    } else {
      data[0].selected = true
      return data
    }
  }
  ClientSelectDropdown(event) {
    console.log('ClientSelectDropdown($event) : ', event);
  }
  getFormValue() {
    return JSON.stringify(this.AgentdeallocationForm.value);
  }

  closeModal(event) {
    console.log('event : ', event);
    this.AgentdeallocationForm.patchValue({ checklist: null });
    this.bucketList = [];
    this.employeeList = [];
    if (event == true) {
      this.ClientListOnChange({})
    }

  }

}
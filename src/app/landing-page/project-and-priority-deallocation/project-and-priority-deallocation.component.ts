import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Token } from 'src/app/manager/token';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
import { ConcluderService } from 'src/app/service/concluder.service';
import { ProjectandpriorityService } from 'src/app/service/projectandpriority.service';

@Component({
  selector: 'app-project-and-priority-deallocation',
  templateUrl: './project-and-priority-deallocation.component.html',
  styleUrls: ['./project-and-priority-deallocation.component.css']
})
export class ProjectAndPriorityDeallocationComponent implements OnInit {
  title = "De-Allocate Module";
  AgentdeallocationForm: FormGroup;
  ClientList: any[] = [];
  userdata;
  UserId: number;
  ClientId = "";
  showOptionButtons: boolean = false;
  ShowAgentModal: boolean = false;
  ShowBucketModal: boolean = false;
  ResponseHelper: ResponseHelper;
  checkevent: boolean = false;
  validated;
  moduleList;
  employeeList;
  byModuleInfo;
  byAgentInfo;
  
  constructor(public fb: FormBuilder, private router: Router, private notification: NotificationService, private projectandpriorityService: ProjectandpriorityService) {
    this.ResponseHelper = new ResponseHelper(this.notification);

  }
  ngOnInit() {
    let token = new Token(this.router);
    this.AgentdeallocationForm = this.fb.group({
      "ClientId": [''],
      "checklist": []
    });
    this.userdata = token.GetUserData();
    this.UserId = this.userdata.UserId;
    //this.ClientList = this.drpService.setSelected(this.userdata.Clients)
    this.ClientList = this.setSelectedDropdown(this.userdata.Clients);

    if (this.ClientList[0].selected == true) {
      this.showOptionButtons = true;

      this.AgentdeallocationForm.patchValue({ 'ClientId': this.ClientList[0].Client_Id });

      this.ClientListOnChange();
    }

    // add for now
    this.AgentdeallocationForm.patchValue({ 'ClientId': 9132 });
    this.ClientListOnChange();
    //this.selectedValue(this.ClientList);
  }

  submitFrom() {
    this.AgentdeallocationForm.reset();
  }

  //to display option button
  ClientListOnChange() {
    const { ClientId } = this.AgentdeallocationForm.value;
    console.log('ClientListOnChange : ', ClientId);
    this.showOptionButtons = true;
    if (ClientId) {
      this.GetModuleList(ClientId);
      this.GetEmpNames(ClientId);
    }
  }

  GetModuleList(ClientId) {
    this.moduleList = [];
    this.employeeList = [];
    this.projectandpriorityService.getEmployeesByModule(ClientId).subscribe(
      res => {
        console.log('GetModuleList res : ', res);
        this.byModuleInfo = res.Data;
      },
      err => {
        this.moduleList = [];
        this.employeeList = [];
        console.log('GetModuleList err : ', err);
        // this.ResponseHelper.GetFaliureResponse(err)
      }
    )
  }

  GetEmpNames(ClientId) {
    // this.GetEmployeeName = [];
    this.moduleList = [];
    this.employeeList = [];
    this.projectandpriorityService.getModulesByEmployee(ClientId).subscribe(
      res => {
        console.log('getEmployeesByBucket res : ', res);
        this.byAgentInfo = res.Data;
      },
      err => {
        this.moduleList = [];
        this.employeeList = [];
        // this.ResponseHelper.GetFaliureResponse(err);
        console.log('getEmployeesByBucket err : ', err);
      }
    )
  }
  //display model

  OpenByModule(event) {

    this.moduleList = this.byModuleInfo ? this.byModuleInfo.Project : [];
    this.employeeList = this.byModuleInfo ? this.byModuleInfo.employees : [];
    console.log('by bucket : ', this.byModuleInfo);
  }
  OpenByAgent(event) {
    this.moduleList = this.byAgentInfo ? this.byAgentInfo.ProjectName_By_Emp_Info : [];
    this.employeeList = this.byAgentInfo ? this.byAgentInfo.Emp_Info : [];
    //_.uniqBy(this.byAgentInfo.employees, 'User_Id');
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
    this.moduleList = [];
    this.employeeList = [];
    if (event == true) {
      this.ClientListOnChange()
    }

  }

}

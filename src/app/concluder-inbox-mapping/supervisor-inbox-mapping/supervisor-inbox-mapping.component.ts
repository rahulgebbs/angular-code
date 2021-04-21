import { Component, OnInit } from '@angular/core';
import { ClientService } from 'src/app/service/client-configuration/client.service';
import { Token } from 'src/app/manager/token';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
import { dropDownFields } from 'src/app/manager/dropdown-feilds';
import { ConcluderInboxMappingService } from 'src/app/concluder-inbox-mapping.service';

@Component({
  selector: 'app-supervisor-inbox-mapping',
  templateUrl: './supervisor-inbox-mapping.component.html',
  styleUrls: ['./supervisor-inbox-mapping.component.scss'],
  providers: [dropDownFields]
})
export class SupervisorInboxMappingComponent implements OnInit {
  ClientId = 9132;
  productivityForm: FormGroup;
  treeData = [];
  token: Token;
  userData;
  clientList = [];
  httpStatus = false;
  startDate;
  endDate;
  clientObj = null;
  ResponseHelper: ResponseHelper;
  maxDate = new Date();
  fieldSetting = {
    singleSelection: false,
    idField: 'Employee_Id',
    textField: 'Full_Name',
    itemsShowLimit: 2,
    closeDropDownOnSelection: true,
    allowSearchFilter: true
  };
  activeUserList = []
  userList = [];
  constructor(
    // private clientService: ClientService,
    private selectedFields: dropDownFields,
    private router: Router,
    private notification: NotificationService,
    private fb: FormBuilder,
    private concluderInboxService: ConcluderInboxMappingService
  ) {
    this.token = new Token(this.router);
    this.userData = this.token.GetUserData();
    this.ResponseHelper = new ResponseHelper(this.notification);
  }
  ngOnInit() {
    this.getClientList();
    this.initForm();
    this.getUserList();
  }

  initForm() {
    this.productivityForm = this.fb.group({
      processName: ['', Validators.required],
      reportType: ['', Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      selectedMonth: [null, Validators.required]
    });
  }

  getClientList() {
    var token = new Token(this.router);
    var userdata = token.GetUserData();
    this.clientList = this.selectedFields.setSelected(userdata.Clients);
    if (this.clientList && this.clientList.length == 1) {
      this.ClientId = this.clientList[0].Client_Id;
      this.getUserList();
    }
  }

  getUserList() {
    console.log('getUserList() : ', this.ClientId);
    this.userList = [];
    this.concluderInboxService.getConcluderUserListByCLientID(this.ClientId).subscribe((response) => {
      console.log('getUserList() : ', response);
      if (response && response.Data) {
        this.userList = response.Data.EmployeeInfo ? response.Data.EmployeeInfo : [];
      }
      else {
        this.userList = []
      }
      this.ResponseHelper.GetSuccessResponse(response);
    }, (error) => {
      this.userList = [];
      this.ResponseHelper.GetFaliureResponse(error);
      console.log('getUserList() error : ', error);
    })
    this.getCategoryList();
  }

  getCategoryList() {
    this.concluderInboxService.getConcluderCategoryListByCLientID(this.ClientId).subscribe((response) => {
      console.log('getConcluderCategoryListByCLientID response : ', response);
      if (response && response.Data) {
        const { Category_Info } = response.Data;
        this.setCategoryList(Category_Info)
      }
      else {
        this.treeData = [];
      }
      this.ResponseHelper.GetSuccessResponse(response);
    }, (error) => {
      this.treeData = [];
      this.ResponseHelper.GetFaliureResponse(error);
      console.log('getConcluderCategoryListByCLientID error : ', error);
    })
  }

  setCategoryList(list) {
    list.forEach(element => {
      element['isExpanded'] = false;
      element['backupList'] = [];
      element['queueList'] = [];
    });
    this.treeData = list;

  }

  toggleNodes(nodeObj, key) {
    // console.log('nodeObj, role : ', nodeObj, nodeObj[key], JSON.stringify(this.treeData));
    // const list = nodeObj[key];
    nodeObj.isExpanded = (nodeObj.isExpanded != undefined && nodeObj.isExpanded == true) ? false : true;
    // if (list && list.length > 0) {
    //   // alert('No '+role.toUpperCase()+' to show');
    //   return false;
    // }
    nodeObj.httpStatus = true;
    switch (key) {
      case 'queue': {
        // nodeObj.backupList = nodeObj.queueList != null && nodeObj.queueList.length > 0 ? JSON.parse(JSON.stringify(nodeObj.queueList)) : [];
        nodeObj.queueList = [];
        this.getQueues(nodeObj);
        break;
      }
      case 'inbox': {
        // nodeObj.backupList = nodeObj.inboxList != null && nodeObj.inboxList.length > 0 ? JSON.parse(JSON.stringify(nodeObj.inboxList)) : [];
        nodeObj.inboxList = [];
        this.getInboxes(nodeObj)
        break;
      }
      default:
        break;
    }
  }



  getQueues(nodeObj) {
    nodeObj.httpStatus = true;
    console.log('getQueues : ', nodeObj);
    // setTimeout(() => {
    //   this.setQueues(nodeObj, nodeObj.backupList)
    // }, 1000);
    this.concluderInboxService.getQueueList(this.ClientId, nodeObj.Name).subscribe((response) => {
      console.log('getQueueList response : ', response);
      if (response && response.Data) {
        this.setQueues(nodeObj, response.Data.Queue_Info);
      }
      else {
        this.setQueues(nodeObj, []);
      }
    }, (error) => {
      console.log('getQueueList error : ', error);
      this.setQueues(nodeObj, [])
    })
    // this.clientService.getManagerProductivityReport(this.userData.TokenValue, this.productivityForm.value['processName'], 1, this.startDate, this.endDate).subscribe((response) => {
    //   console.log('response : ', response);
    //   this.setQueues(nodeObj, response.Data.manager_InventoryList_count);
    // }, (error) => {
    //   console.log('error : ', error);
    //   nodeObj.httpStatus = false;
    //   nodeObj.refreshStatus = false;
    //   this.ResponseHelper.GetFaliureResponse(error);
    //   nodeObj.manager = [];
    // });
  }

  setQueues(nodeObj, queueList) {
    console.log('setQueues : ', nodeObj, queueList);
    if (queueList && queueList.length > 0) {
      queueList.forEach((element: any) => {
        element.inboxList = [];
      });
    }

    nodeObj.queueList = queueList != null && queueList.length > 0 ? queueList : [];
    nodeObj.httpStatus = false;
    nodeObj.refreshStatus = false;
  }

  getInboxes(nodeObj) {
    console.log('getInboxes nodeObj : ', nodeObj);
    nodeObj.httpStatus = true;
    // nodeObj.backupList = JSON.parse(JSON.stringify(nodeObj.inboxList));
    // nodeObj.inboxList = [];
    this.concluderInboxService.getInboxList(this.ClientId, nodeObj.Name).
      subscribe((response) => {
        console.log('response : ', response);
        if (response && response.Data) {
          this.setInboxes(nodeObj, response.Data.Inbox_Info);
        }
        else {
          this.setInboxes(nodeObj, []);
        }
      }, (error) => {
        this.setInboxes(nodeObj, []);
        console.log('error : ', error);
      })
    // const { startDate, endDate } = this.productivityForm.value;
    // this.clientService.getSupervisorProductivityReport(this.userData.TokenValue, this.productivityForm.value['processName'], nodeObj.EmployeeID, 1, this.startDate, this.endDate).subscribe((response) => {
    //   console.log('response : ', response)
    //   this.setInboxes(nodeObj, response.Data.manager_InventoryList_count);
    // }, (error) => {
    //   console.log('error : ', error);
    //   nodeObj.httpStatus = false;
    //   nodeObj.supervisor = [];
    //   this.ResponseHelper.GetFaliureResponse(error);
    // })
  }

  setInboxes(nodeObj, inboxList) {
    console.log('setInboxes : ', nodeObj, inboxList);
    if (inboxList && inboxList.length > 0) {
      nodeObj.inboxList = inboxList && inboxList.length > 0 ? inboxList : [];
      nodeObj.backupList = inboxList && inboxList.length > 0 ? inboxList : [];
    }
    else {
      nodeObj.inboxList = [];
      nodeObj.backupList = [];
    }

    nodeObj.httpStatus = false;
  }
  matchInbox(queue) {
    // console.log('matchInbox : ', queue);
    queue.inboxList.forEach((element) => {
      var result = element.Name.toUpperCase().indexOf(queue.inboxName.toUpperCase());
      if (result !== -1) {
        element.show = true;
      }
      else {
        element.show = false;
      }
      // console.log('result : ', result, queue.inboxName, element.inbox)
    })
  }

  ascending() {

  }

}

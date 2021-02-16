import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
// import { ConcluderService } from 'src/app/service/concluder.service';
// api/PNP_Inventory_Bucket_Count_Controller/{client_Id}

import * as _ from 'lodash';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
import { ProjectandpriorityService } from 'src/app/service/projectandpriority.service';
@Component({
  selector: 'app-accounts-modal-project-and-priority',
  templateUrl: './accounts-modal-project-and-priority.component.html',
  styleUrls: ['./accounts-modal-project-and-priority.component.css']
})
export class AccountsModalProjectAndPriorityComponent implements OnInit {
  @Input() userdata;
  @Output() accountClick = new EventEmitter();
  @Output() CloseModal = new EventEmitter()
  concluderId;
  AccountsList = [];
  RowSelection = "single";
  columnDefs = []
  allData = [];
  gridOptions: any = {
    context: {
      componentParent: this
    }
  };
  ResponseHelper: ResponseHelper;
  bucketList = [];
  activeProject = null;
  activeFieldList = [];
  projectList = [];
  gridColumnApi;
  gridApi;
  projectListStatus = false;
  PNP_Inventory_Log_Id;
  accountListStatus = false;
  refreshProjectStatus = false;
  constructor(
    // private concluderService: ConcluderService,
    private projectandpriorityService: ProjectandpriorityService,
    private notificationservice: NotificationService) {
    this.ResponseHelper = new ResponseHelper(this.notificationservice);
  }
  ngOnInit() {
    this.columnDefs = [
      { headerName: 'Payer', field: 'Group_By_Field_Value' },
      { headerName: 'TFL Status', field: 'TFL_Status' },
      { headerName: 'Days', field: 'Days' },
      { headerName: 'Amount ($)', field: 'Dollar_Value' },
      { headerName: 'V/N', field: 'Voice_NonVoice' },
      { headerName: 'Completion Date', field: 'Completion_Date' },
      { headerName: 'Encounter No', field: 'Encounter_Number' },
      { headerName: 'Account No', field: 'Account_Number' }
    ];
    this.projectList = [];
    this.getPNPProjectList();
    // this.getDataByProjectName('');
  }

  getPNPProjectList() {
    console.log('userdata : ', this.userdata);
    const { Clients, Employee_Code } = this.userdata;
    this.projectListStatus = true;
    // this.projectList = [];
    this.projectandpriorityService.getProjectList(Clients[0].Client_Id, Employee_Code).subscribe((response) => {
      console.log('getProjectList response : ', response);
      this.projectList = response.Data;
      this.refreshProjectStatus = false;
      this.projectListStatus = false;
      // this.ResponseHelper.GetSuccessResponse(response);
    }, (error) => {
      console.log('error : ', error);
      this.projectList = [];
      this.projectListStatus = false;
      this.refreshProjectStatus = false;
      this.ResponseHelper.GetFaliureResponse(error);
    });
  }

  getDataByProjectName(project) {
    // if (this.AccountsList == null) {
    //   return false;
    // }
    this.AccountsList = [];

    this.accountListStatus = true;
    // this.gridOptions.api.showLoadingOverlay();
    this.activeProject = project.Project_Name;
    const { Clients, Employee_Code } = this.userdata;
    this.projectandpriorityService.getAccountsByProject(Clients[0].Client_Id, project.Encrypted_Project_Name).subscribe((response) => {
      console.log('getProjectList response : ', response.Data.PNP_Inventory_Info);
      this.accountListStatus = false;
      this.allData = response.Data.PNP_Inventory_Info;
      this.formatInventory();
      this.ResponseHelper.GetSuccessResponse(response);
      this.refreshProjectStatus = true;
      this.getPNPProjectList();
    }, (error) => {
      this.AccountsList = [];
      this.accountListStatus = false;
      console.log('getProjectList error : ', error);
      this.refreshProjectStatus = true;
      this.getPNPProjectList();
      this.ResponseHelper.GetFaliureResponse(error);
    });
  }

  formatInventory() {
    const list = [];
    console.log('formatInventory : ', this.allData);

    const mainObj = this.allData[0];
    const keyList = Object.keys(mainObj);
    this.allData.forEach((element) => {
      keyList.forEach((key) => {
        element[key] = element[key] != null ? element[key] : "N/A"
      })
    });
    this.AccountsList = JSON.parse(JSON.stringify(this.allData));
    setTimeout(() => {
      this.sizeToFit();
    }, 100);
    this.PNP_Inventory_Log_Id = this.AccountsList[0].PNP_Inventory_Log_Id;
    this.getAllFields(this.AccountsList[0], false);
  }

  Close() {
    this.CloseModal.emit();
  }

  getAllFields(data, status) {
    console.log('getAllFields data : ', data, this.activeProject);
    const { PNP_Inventory_Id, PNP_Inventory_Log_Id } = data;
    const { Clients } = this.userdata;
    this.projectandpriorityService.getPNPFields(Clients[0].Client_Id, PNP_Inventory_Id, PNP_Inventory_Log_Id, this.activeProject)
      .subscribe((response) => {
        console.log('getPNPFields response : ', response);
        this.activeFieldList = response.Data;
        this.projectandpriorityService.setLocalAccount(this.AccountsList);
        this.accountClick.emit({ AccountsList: this.activeFieldList, PNP_Inventory_Id: PNP_Inventory_Id, PNP_Inventory_Log_Id: PNP_Inventory_Log_Id, closePopup: status, activeReasonBucket: this.activeProject });
        this.saveIntoLocal();
      }, (error) => {
        console.log('getPNPFields error : ', error);
      });
  }

  closeModal() {
    // this.activeFieldList.forEach((field) => {
    //   field['Is_View_Allowed_Agent'] = true;
    // });
    // this.accountClick.emit({ AccountsList: this.activeFieldList, closePopup: status });
    // this.saveIntoLocal();

    this.projectandpriorityService.showProjectModal = false;
  }

  saveIntoLocal() {
    this.projectandpriorityService.setLocalAccount(this.AccountsList);
    // console.log('localAccounts : ', localAccounts);
    // sessionStorage.setItem('pnpAccounts', JSON.stringify(this.AccountsList));
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  autoSizeAll(skipHeader) {
    var allColumnIds = [];
    if (this.gridColumnApi) {
      this.gridColumnApi.getAllColumns().forEach(function (column) {
        allColumnIds.push(column.colId);
      });
      this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
    }
    console.log('autoSizeAll : ', skipHeader, this.gridColumnApi);
  }
  sizeToFit() {
    if (this.gridApi)
      this.gridApi.sizeColumnsToFit();
  }
  rowClick(row) {
    const { PNP_Inventory_Id, PNP_Inventory_Log_Id } = row;
    const { Clients } = this.userdata;
    console.log('rowClick event : ', row, this.PNP_Inventory_Log_Id);
    if (PNP_Inventory_Log_Id == this.PNP_Inventory_Log_Id) {
      this.getAllFields(row, true);
      // this.accountClick.emit({ AccountsList: this.activeFieldList, Inventory_Id: PNP_Inventory_Id, Inventory_Log_Id: PNP_Inventory_Log_Id, closePopup: true });
      return true;
    }
    // let data = JSON.parse(JSON.stringify(row));
    this.projectandpriorityService.updatePNPTime(Clients[0].Client_Id, PNP_Inventory_Id, this.PNP_Inventory_Log_Id).subscribe((response: any) => {
      console.log('updatePNPTime response : ', response);
      this.ResponseHelper.GetSuccessResponse(response);
      this.PNP_Inventory_Log_Id = response.Data;
      row.PNP_Inventory_Log_Id = this.PNP_Inventory_Log_Id;
      this.getAllFields(row, true);
    }, (error) => {
      console.log('updatePNPTime error : ', error);
      this.ResponseHelper.GetFaliureResponse(error);
    });

  }
}

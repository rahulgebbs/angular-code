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
  // @Input() UserId;
  @Output() conclusionRowClick = new EventEmitter();
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
  constructor(
    // private concluderService: ConcluderService,
    private projectandpriorityService: ProjectandpriorityService,
    private notificationservice: NotificationService) {
    this.ResponseHelper = new ResponseHelper(this.notificationservice);
  }
  ngOnInit() {
    this.columnDefs = [];
    this.getConcludedBucketList();
    // this.getDataByProjectName('');
  }

  getConcludedBucketList() {
    console.log('userdata : ', this.userdata);
    const { Clients, Employee_Code } = this.userdata;
    this.projectandpriorityService.getProjectList(Clients[0].Client_Id, Employee_Code).subscribe((response) => {
      console.log('getProjectList response : ', response);
      this.projectList = response.Data;
      this.ResponseHelper.GetSuccessResponse(response);
    }, (error) => {
      console.log('error : ', error);
      this.projectList = [];
      this.ResponseHelper.GetFaliureResponse(error);
    })
    // this.concluderService.getConcludedBucketCount(this.ClientId).subscribe((response) => {
    //   console.log('response : ', response);
    //   this.bucketList = response.Data;
    //   this.ResponseHelper.GetSuccessResponse(response);
    // }, (error) => {
    //   console.log('error : ', error);
    //   this.ResponseHelper.GetFaliureResponse(error);
    // })
  }

  getDataByProjectName(projectName) {
    if (this.AccountsList == null) {
      return false;
    }
    this.AccountsList = null;
    // this.gridOptions.api.showLoadingOverlay();
    this.activeProject = projectName;
    const { Clients, Employee_Code } = this.userdata;
    this.projectandpriorityService.getAccountsByProject(Clients[0].Client_Id, projectName).subscribe((response) => {
      console.log('getProjectList response : ', response.Data.PNP_Inventory_Info)
      this.allData = response.Data.PNP_Inventory_Info;
      this.formatInventory();
      this.ResponseHelper.GetSuccessResponse(response);
    }, (error) => {
      this.AccountsList = [];
      console.log('getProjectList error : ', error)
    })
    // this.concluderService.getConclusionDataByBucket(this.ClientId, this.UserId, bucketName).subscribe((response) => {
    //   console.log('getConcludedBucketCount response : ', response);
    //   this.allData = response.Data;
    //   // setTimeout(() => {
    //   this.formatInventory();
    //   this.ResponseHelper.GetSuccessResponse(response);
    //   // }, 2000);
    // }, (error) => {
    //   this.AccountsList = [];
    //   this.ResponseHelper.GetFaliureResponse(error);
    //   console.log('getConcludedBucketCount error : ', error);
    // })
  }
  formatInventory() {
    const list = [];
    console.log('formatInventory : ', this.allData);
    this.columnDefs = [
      // { field: 'Inventory_Id', hide: true, rowGroupIndex: null },
      // { headerName: this.PayerName, field: this.PayerName },
      {
        headerName: 'TFL Status', field: 'TFL_Status'
      },
      { headerName: 'Days', field: 'Days' },
      { headerName: 'Amount ($)', field: 'Dollar_Value' },
      { headerName: 'V/N', field: 'Voice_NonVoice' },
      { headerName: 'Completion Date', field: 'Completion_Date' },
      { headerName: 'Encounter No', field: 'Encounter_Number' },
      { headerName: 'Account No', field: 'Account_Number' }
    ]
    const mainObj = this.allData[0];
    console.log('mainObj : ', Object.keys(mainObj));
    const keyList = Object.keys(mainObj);
    this.allData.forEach((element) => {
      keyList.forEach((key) => {
        element[key] = element[key] != null ? element[key] : "N/A"
      })
    })
    // this.allData.forEach((data) => {
    //   this.columnDefs.push({ headerName: field.Header_Name, field: field.Header_Name });
    //   const obj = {};
    //   // data.forEach((field) => {
    //   this.columnDefs.push({ headerName: field.Header_Name, field: field.Header_Name });
    //   // obj[field.Header_Name] = field.Field_Value;
    //   // });
    //   // obj["Bucket_Name"] = "Concluded";
    //   // list.push(obj);
    // });
    // this.columnDefs = _.uniqBy(this.columnDefs, (column) => {
    //   return column.headerName;
    // });
    this.AccountsList = JSON.parse(JSON.stringify(this.allData));
    // this.autoSizeAll(true);
    setTimeout(() => {
      // this.rowData = JSON.parse(JSON.stringify(this.rowData));
      this.sizeToFit();
    }, 100);
    // console.log('this.AccountsList : ', this.AccountsList, this.columnDefs);i
    this.getAllFields(this.AccountsList[0], false);
  }
  Close() {
    this.CloseModal.emit();
  }
  getAllFields(data, status) {
    // this.concluderId = data.Concluder_Id;
    // console.log('getAllFields() : ', data.Concluder_Id, this.concluderId);
    // sessionStorage.setItem('conclusionBucket', this.activeProject);
    // this.concluderService.getConclusionDataByConcludeID(this.ClientId, this.concluderId, this.activeProject).subscribe((response) => {
    //   console.log('getConclusionDataByConcludeID response : ', response);
    //   this.activeFieldList = response.Data;
    //   this.closeModal(status);
    // }, (error) => {
    //   console.log('getConclusionDataByConcludeID error : ', error);
    // })
  }

  closeModal() {
    // this.activeFieldList.forEach((field) => {
    //   field['Is_View_Allowed_Agent'] = true;
    // });
    // this.conclusionRowClick.emit({ status: status, AccountsList: this.activeFieldList, concluderId: this.concluderId, popup: status });
    // this.saveIntoLocal();
    this.projectandpriorityService.showProjectModal = false;
  }

  saveIntoLocal() {
    // sessionStorage.setItem('concluderAccounts', JSON.stringify(this.allData));
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    // params.columnApi.autoSizeColumns();
    // params.api.sizeColumnsToFit();
    // this.sizeToFit()
    // this.autoSizeAll(false)
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

    console.log('this.gridApi : ', this.gridApi);
  }
}

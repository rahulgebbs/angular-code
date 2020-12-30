import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ConcluderService } from 'src/app/service/concluder.service';

import { Router } from '@angular/router';
import { Token } from 'src/app/manager/token';
import { NotificationService } from 'src/app/service/notification.service';
import { ProjectandpriorityService } from 'src/app/service/projectandpriority.service';
import { ResponseHelper } from 'src/app/manager/response.helper';

@Component({
  selector: 'app-project-reallocation',
  templateUrl: './project-reallocation.component.html',
  styleUrls: ['./project-reallocation.component.scss']
})
export class ProjectReallocationComponent implements OnInit {
  ShowModal = true;
  ResponseHelper: ResponseHelper;
  @Input() Client_Id;
  @Input() activeProject;
  rowData = [];
  gridApi;
  gridColumnApi
  rowSelection = 'single'
  @Output() close = new EventEmitter<any>();
  agentList = [];
  clientSetting = {
    singleSelection: true,
    idField: 'Employee_Code',
    textField: 'Full_Name',
    itemsShowLimit: 3,
    closeDropDownOnSelection: true,
    allowSearchFilter: true
  }
  showReAllocation = null;
  columnDefs = [
    {
      headerName: 'Allocated to', field: 'Allocated_To', suppressSizeToFit: true
    },
    {
      headerName: 'Allocated Count', field: 'Account_Count', suppressSizeToFit: true, cellStyle: function (params) {
        return { textAlign: 'center' };

      }
    },
    {
      headerName: "Status", cellRenderer: this.showCellRenderer, suppressSizeToFit: true
    }
    // ,
    // {
    //   headerName: "Action", cellRenderer: this.showCellRenderer, suppressSizeToFit: true
    // }
  ];
  token: Token;
  userData: any = null;
  activeAgent = null;
  selectedAgentList = null;
  submitStatus = false;
  activeUserID = null;
  constructor(private concluderService: ConcluderService, public router: Router, private notification: NotificationService, private projectandpriorityService: ProjectandpriorityService) {
    this.ResponseHelper = new ResponseHelper(this.notification);
  }

  ngOnInit() {
    console.log('Client_Id : ', this.Client_Id, this.activeProject);
    this.token = new Token(this.router);
    this.userData = this.token.GetUserData();
    this.getProjectListCount();
  }

  getProjectListCount() {
    this.rowData = null;
    this.projectandpriorityService.getProjectListCount(this.Client_Id, this.activeProject).subscribe((response) => {
      console.log('getProjectListCount response : ', response);
      setTimeout(() => {
        this.rowData = response.Data[0].allocated_Counts;
        this.sizeToFit();
        setTimeout(() => {
          this.autoSizeAll(true);
        }, 500);
      }, 1000);
    }, (error) => {
      setTimeout(() => {

        this.rowData = [];
        this.sizeToFit();
        setTimeout(() => {
          this.autoSizeAll(true);
        }, 500);
      }, 1000);
      console.log('getProjectListCount error : ', error);
    })
  }

  showCellRenderer(params) {
    var eGui: any = document.createElement("div");
    eGui.innerHTML = `<button  class="btn label gray label-info square-btn cursor" data-action-type="update" title="Re-Allocate">Re-Allocate</button>`;
    return eGui;
  }

  getData(params) {
    console.log('cellClicked : ', params);
    if (this.showReAllocation == true) {
      return true;
    }
    if (params.colDef.headerName == 'Status') {
      this.activeAgent = params.data;
      console.log('getData : ', params);
      this.showReAllocation = true;
      this.agentList = [];
      this.activeUserID = params.data.Employee_Id;
      this.projectandpriorityService.getEmployeesAllocatedToProject(this.Client_Id, this.activeProject, this.activeUserID).subscribe((response) => {
        console.log('getEmployeesAllocatedToProject response : ', response);
        this.agentList = response != null && response.Data != null ? response.Data : [];
        this.showReAllocation = false;
        response.Data.forEach((element, index) => {
          if (element.Id == this.activeAgent.Employee_Id) {
            response.Data.splice(index, 1);
          }
        });
        this.agentList = response != null && response.Data != null ? response.Data : [];
      }, (error) => {
        this.agentList = [];
        this.showReAllocation = false;
        console.log('getEmployeesAllocatedToProject response : ', error);
      });
    }
    // else {
    //   this.showReAllocation = false;
    // }
  }

  getAllocatedCountList(clientId, Employee_Code, bucket_name) {
  }

  getAllEmployeeByClient(clientId) {
  }

  removeAgent() {
    console.log('removeAgent() : ', this.activeAgent, this.agentList);
    this.agentList.forEach((agent, index) => {
      if (agent.Full_Name == this.activeAgent.Allocated_To) {
        this.agentList.splice(index, 1);
      }
    })
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // params.columnApi.autoSizeColumns();
    // params.api.sizeColumnsToFit();
    this.sizeToFit()
    this.autoSizeAll(true)
  }

  dismissModel() {
    this.close.emit();
  }
  sizeToFit() {
    if (this.gridApi)
      this.gridApi.sizeColumnsToFit();

    console.log('this.gridApi : ', this.gridApi);
  }
  autoSizeAll(skipHeader) {
    var allColumnIds = [];
    if (this.gridColumnApi) {
      this.gridColumnApi.getAllColumns().forEach(function (column) {
        allColumnIds.push(column.colId);
      });
      this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
    }
    // console.log('autoSizeAll : ', skipHeader, this.gridColumnApi);
  }

  allocateAccount() {
    const finalObj = {
      "Client_id": this.Client_Id,
      "Allocated_To": this.activeUserID,
      "Project_Name": this.activeProject,
      "Employee_Codes": this.selectedAgentList.map(a => Number(a.Employee_Code))
    }
    console.log('allocateAccount : ', finalObj);
    this.projectandpriorityService.reallocateProject(finalObj).subscribe((response) => {
      console.log('reallocateProject response : ', response);
      this.ResponseHelper.GetSuccessResponse(response);
      this.dismissModel();
    }, (error) => {
      this.ResponseHelper.GetFaliureResponse(error);
      this.dismissModel();
      console.log('reallocateProject response : ', error);
    });
  }
}

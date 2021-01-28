import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Token } from 'src/app/manager/token';
import { NotificationService } from 'src/app/service/notification.service';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { ProjectandpriorityService } from 'src/app/service/projectandpriority.service';
// jwt_decode
import * as jwt_decode from "jwt-decode";
@Component({
  selector: 'app-project-and-priority-dashboard',
  templateUrl: './project-and-priority-dashboard.component.html',
  styleUrls: ['./project-and-priority-dashboard.component.css']
})
export class ProjectAndPriorityDashboardComponent implements OnInit {
  employeeModalTitle = 'Add Agent screen';
  Employees = [];
  ResponseHelper: ResponseHelper;
  dashboardForm: FormGroup;
  typeList = ['All', 'Active', 'Inactive'];
  userData;
  Client_Id = null;
  projectList = [];
  title = "Project & Priority Dashboard";

  dollarcolumnDefs = [
    {
      headerName: 'Dollar-Wise',
      resizable: false,
      // cellStyle: (params) => { return { color: 'red', textAlign: 'center' } },

      children: [
        {
          headerName: 'Project Name',
          width: '200',
          field: 'Project_Name',
          filter: 'agTextColumnFilter'
        },
        {
          headerName: 'Total',
          // width: '50',
          field: 'Total_Dollar',
          suppressFilter: true
        },
        {
          headerName: 'Pending',
          // width: '70',
          field: 'Pending_Dollar',
          suppressFilter: true
        },
        {
          headerName: 'Completed',
          // width: '70',
          field: 'Completed_Dollar',
          suppressFilter: true

        },
        {
          headerName: '%%',
          // width: '30',
          field: 'Percentage_Dollar',
          suppressFilter: true,
          valueFormatter: this.formatPercentage

        },
        {
          headerName: 'Users',
          // width: '50',
          field: 'Project_Users',
          suppressFilter: true,
          valueFormatter: this.formatUser,
          cellStyle: { 'color': 'blue', 'text-decoration': 'underline', 'cursor': 'pointer' }


        },
        {
          headerName: 'Status',
          width: '50',
          cellRenderer: this.DollarActionButton
        },
        {
          headerName: 'Action',
          width: '50',
          cellRenderer: this.addAgentCellRenderer
        }
      ]
    }
  ];
  columnDefs = [
    {
      headerName: 'Count-Wise',
      resizable: false,
      children: [
        {
          headerName: 'Project Name',
          width: '200',
          field: 'Project_Name',
          filter: 'agTextColumnFilter'
        },
        {
          headerName: 'Total',
          // width: '50',
          field: 'Total_Count',

          suppressFilter: true
        },
        {
          headerName: 'Pending',
          // width: '50',
          field: 'Pending_Count',
          suppressFilter: true
        },
        {
          headerName: 'Completed',
          // width: '50',
          field: 'Completed_Count',
          suppressFilter: true
        },
        {
          headerName: '%%',
          //width: '30',
          field: 'Percentage_Count',
          valueFormatter: this.formatPercentage,

          suppressFilter: true
        },
        {
          headerName: 'Users',
          // width: '50',
          field: 'Project_Users',
          suppressFilter: true,
          cellStyle: { 'color': 'blue', 'text-decoration': 'underline', 'cursor': 'pointer' }
        },
        {
          headerName: 'Status',
          width: '50',
          cellRenderer: this.ActionCellRendererClass
        },
        {
          headerName: 'Action',
          width: '50',
          cellRenderer: this.addAgentCellRenderer
        }
      ]
    }
  ];

  gridOptions: any = {
    context: {
      componentParent: this
    }
  };
  dollarGridOptions: any = {

    context: {
      componentParent: this
    }
  };
  gridApi;
  gridColumnApi;

  dollarDridOptions: any = {
    context: {
      componentParent: this
    }
  };
  deActivateModal = false;
  dollarGridApi;
  dollarColumnApi;
  activeProject = null;
  reAllocateModal = false;
  ClientList = [];
  showAddAgentModal = false;
  constructor(private router: Router, private notification: NotificationService, public fb: FormBuilder, private projectandpriorityService: ProjectandpriorityService) {
    this.ResponseHelper = new ResponseHelper(this.notification);
    this.dashboardForm = this.fb.group({
      'ClientId': [null],
      "dashboardType": [null]
    });
  }

  formatPercentage(params) {
    console.log('params percentage : ', params.value)
    if (params && params.value > 0) {
      return `${Math.round(params.value)}%`;
    }
    return params.value;
  }

  getClientName() {
    const { value } = this.dashboardForm;
    if (value && value.ClientId != null && value.dashboardType != null) {

    }
  }

  formatUser(params) {
    return params.value;
  }

  ngOnInit() {
    this.userData = jwt_decode(sessionStorage.getItem('access_token'));
    const { Clients } = this.userData;
    this.ClientList = Clients;
    console.log('this.ClientList : ', this.ClientList);
    if (Clients && Clients.length == 1) {
      this.Client_Id = Clients[0] && Clients[0].Client_Id ? Clients[0].Client_Id : null;
      this.dashboardForm.patchValue({ 'ClientId': this.Client_Id })
    }
  }

  onGridReady(event) {
    this.gridApi = event.api;
    this.gridColumnApi = event.columnApi;
    var allColumnIds = [];
    if (this.gridColumnApi) {
      this.gridColumnApi.getAllColumns().forEach(function (column) {
        allColumnIds.push(column.colId);
      });
      this.gridColumnApi.autoSizeColumns(allColumnIds, false);
      this.sizeToFit();
    }
  }

  onDollarGridReady(event) {
    this.dollarGridApi = event.api;
    this.dollarColumnApi = event.columnApi;
    var allColumnIds = [];
    if (this.dollarColumnApi) {
      this.dollarColumnApi.getAllColumns().forEach(function (column) {
        allColumnIds.push(column.colId);
      });
      this.dollarColumnApi.autoSizeColumns(allColumnIds, false);
      this.sizeToFit();
    }
  }

  typeChange() {
    const { value } = this.dashboardForm;
    if (value && value.ClientId && value.dashboardType) {
      this.Client_Id = value.ClientId;
      // this.projectList = null;
      if (this.gridOptions && this.gridOptions.api && this.dollarDridOptions && this.dollarDridOptions.api) {
        this.gridOptions.api.showLoadingOverlay();
        this.dollarDridOptions.api.showLoadingOverlay();
      }
      else {
        try {
          this.gridOptions.api.showLoadingOverlay();
          this.dollarDridOptions.api.showLoadingOverlay();
        } catch (error) {
          console.log('try catcherror : ', error)
          this.projectList = null;
        }
      }

      switch (value.dashboardType) {
        case 'all': {
          this.getAllProjectList();
          break;
        }
        case 'active': {
          this.getActiveProjectList();
          break;
        }
        case 'inactive': {
          this.getInActiveProjectList();
          break;
        }
        default:
          break;
      }
    }
    else {
      this.projectList = [];
    }
    // console.log('typeChange() : ', this.dashboardForm.value);
  }
  // changeProjectType() {
  //   console.log('')

  // }

  getActiveProjectList() {
    // this.projectList = null;
    // console.log('getActiveProjectList : ', this.dashboardForm);
    const { value } = this.dashboardForm;
    let query = `api/PNP-Dashboard-Active/Client/${value.ClientId}`;
    this.projectandpriorityService.getPNPProjectList(query).subscribe((response) => {
      console.log('getActiveProjectList response: ', response);
      this.manageGridView(response.Data);
      this.ResponseHelper.GetSuccessResponse(response);
    }, (error) => {
      this.ResponseHelper.GetFaliureResponse(error);
      this.manageGridView({ get_Response_Grid: [] });
      console.log('getActiveProjectList error: ', error);
    });
  }

  getInActiveProjectList() {
    // this.projectList = null;
    const { value } = this.dashboardForm;
    // console.log('getInActiveProjectList : ', this.dashboardForm);
    let query = `api/PNP-Dashboard-Deactive/Client/${value.ClientId}`;
    this.projectandpriorityService.getPNPProjectList(query).subscribe((response) => {
      console.log('getInActiveProjectList response: ', response);
      this.ResponseHelper.GetSuccessResponse(response);
      this.manageGridView(response.Data);
    }, (error) => {
      this.ResponseHelper.GetFaliureResponse(error);
      this.manageGridView({ get_Response_Grid: [] });
      console.log('getInActiveProjectList error: ', error);
    });
  }

  getAllProjectList() {
    // this.projectList = null;
    // console.log('getAllProjectList : ', this.dashboardForm);
    const { value } = this.dashboardForm;
    let query = `api/PNP-Dashboard-All/Client/${value.ClientId}`;
    this.projectandpriorityService.getPNPProjectList(query).subscribe((response) => {
      console.log('getAllProjectList response: ', response);
      this.manageGridView(response.Data);
      this.ResponseHelper.GetSuccessResponse(response);
    }, (error) => {
      console.log('getAllProjectList error: ', error);
      this.manageGridView({ get_Response_Grid: [] });
      this.ResponseHelper.GetFaliureResponse(error);
    });

  }

  manageGridView(Data) {
    const { value } = this.dashboardForm;
    console.log('manageGridView(Data) : ', Data, value.dashboardType);
    if (value && value.dashboardType && Data.get_Response_Grid && Data.get_Response_Grid.length > 0) {
      this.projectList = JSON.parse(JSON.stringify(Data.get_Response_Grid))
      this.projectList.forEach((element) => {
        switch (value.dashboardType) {
          case 'active': {
            this.projectList.forEach((element) => {
              element.Status = 'ACTIVE';
            })
            break;
          }
          case 'inactive':
            {
              this.projectList.forEach((element) => {
                element.Status = 'DEACTIVE';
              })
              break
            };
          default:
            break;
        }
      })
    }
    else {
      this.projectList = [];
    }
    this.sizeToFit();
  }
  sizeToFit() {
    // console.log('sizeToFit : ', this.projectList);
    if (this.projectList == null || this.projectList.length == 0) {
      return null
    }
    if (this.gridApi) {
      this.gridApi.sizeColumnsToFit();
    }
    if (this.dollarGridApi) {
      this.dollarGridApi.sizeColumnsToFit();
    }
    this.autoSizeAll(true);
  }
  autoSizeAll(skipHeader) {
    var allColumnIds = [];
    if (this.gridColumnApi) {
      this.gridColumnApi.getAllColumns().forEach(function (column) {
        allColumnIds.push(column.colId);
      });
      this.gridColumnApi.autoSizeColumns(allColumnIds, false);
    }

    var dollarColumnIds = [];
    if (this.dollarColumnApi) {
      this.dollarColumnApi.getAllColumns().forEach(function (column) {
        dollarColumnIds.push(column.colId);
      });
      this.dollarColumnApi.autoSizeColumns(dollarColumnIds, skipHeader);
    }
  }

  ActionCellRendererClass(params) {
    let val
    let eDiv = document.createElement('div');
    // params.value = false;
    // console.log('CountActionButton : ', params);
    const { node } = params;
    if (node && node.data && node.data.Status == 'ACTIVE') {
      val = "De-Activate";
      eDiv.innerHTML = '<button  class="btn label grey label-info square-btn cursor " data-action-type="update">' + val + '</button>';
    } else {
      val = 'De-Active';
      eDiv.innerHTML = '<button disabled class="btn label square-btn cursor" style="color:#000;font-size: 13px;font-weight: normal;padding: 3px 5px;width: 80px;float: left;border: 1px solid gray;">' + val + '</button>';
    }
    return eDiv;
  }

  DollarActionButton(params) {
    let val
    let eDiv = document.createElement('div');
    // console.log('DollarActionButton : ', params);
    // params.value = false;
    const { node } = params;
    console.log('node.data : ', node.data.Status)
    if (node && node.data && node.data.Status == 'ACTIVE') {
      val = "De-Activate";
      eDiv.innerHTML = '<button  class="btn label grey label-info square-btn cursor " data-action-type="update">' + val + '</button>';
    } else {
      val = 'De-Active';
      eDiv.innerHTML = '<button disabled class="btn label square-btn cursor" style="color:#000;font-size: 13px;font-weight: normal;padding: 3px 5px;width: 80px;float: left;border: 1px solid gray;">' + val + '</button>';
    }
    return eDiv;
  }

  cellClicked(event) {
    // console.log('cellClicked(event) : ', event);
    const { column, data } = event;
    console.log('cellClicked : ', event);
    if (column && column.colDef) {
      const { headerName } = column.colDef;
      if (headerName == 'Status') {
        console.log('IF headerName : ', headerName);
        this.deActivateModal = true;
      }
      if (headerName == 'Users') {
        this.reAllocateModal = true;
      }
      if (headerName == 'Action') {
        // this.showAddAgentModal = true;
        this.getNewEmployeesForProject(data.Project_Name)
      }
      this.activeProject = event.data.Project_Name;
    }
    console.log('this.activeProject : ', this.activeProject);
  }

  closeDeactivateModal(event) {
    // console.log('closeDeactivateModal : ', event);
    if (event == true) {
      this.typeChange();
    }
    this.deActivateModal = false;
  }

  closeReAllocateModal(event) {
    this.reAllocateModal = false;
  }

  addAgentCellRenderer(params) {
    var eGui: any = document.createElement("div");
    eGui.innerHTML = '<button style="color:#fff;background-color:#0078ae" class="btn label grey label-info square-btn cursor " data-action-type="update">Add Agent</button>';
    return eGui;
  }

  getNewEmployeesForProject(projectName) {
    this.Employees = [];
    const { value } = this.dashboardForm;
    console.log('Client_Id : ', this.Client_Id);
    this.projectandpriorityService.getEmployeesForProject(value.ClientId, projectName).subscribe((response) => {
      console.log('getNewEmployeesForProject response : ', response);
      if (response && response.Data) {
        this.showAddAgentModal = true;
        this.Employees = response.Data;
        this.Employees.forEach(element => {
          element.Employee_Code = element.Employee_Code != null ? element.Employee_Code : element.Id;
        });
      }
      this.ResponseHelper.GetSuccessResponse(response);
    }, (error) => {
      console.log('error : ', error);
      this.ResponseHelper.GetFaliureResponse(error);
      this.Employees = [];
      this.showAddAgentModal = false;
      // this.Employees = response.Data;
      // this.Employees.forEach(element => element.Employee_Code = element.Id)
    });
  }
  SetSelectedEmp(event) {
    // console.log('SetSelectedEmp : ', event);
    this.showAddAgentModal = false;
    const { value } = this.dashboardForm;
    const formBody = {
      "Client_id": value.ClientId,
      "Project_Name": this.activeProject,
      "Employee_Codes": event.map(ele => ele.Id)
    }
    console.log('formBody : ', formBody);
    this.Employees.forEach((element) => element.Is_Selected = false);
    this.projectandpriorityService.addAgentToProject(formBody).subscribe((response) => {
      console.log('addAgentToProject response : ', response);
      this.ResponseHelper.GetSuccessResponse(response);
    }, (error) => {
      console.log('addAgentToProject error : ', error);
      this.ResponseHelper.GetFaliureResponse(error);
    })
  }

  CloseModal(event) {
    console.log('CloseModal : ', event);
    this.showAddAgentModal = false;
  }
}

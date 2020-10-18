import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Token } from '../../../manager/token';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { ProjectandpriorityService } from 'src/app/service/projectandpriority.service';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-special-project',
  templateUrl: './special-project.component.html',
  styleUrls: ['./special-project.component.scss']
})
export class SpecialProjectComponent implements OnInit {
  @Input() ClientData;
  @Output() next_page = new EventEmitter<any>();
  Popup: boolean = false
  addSaag: FormGroup;
  token: Token;
  userData;
  rowData = [];
  ResponseHelper;

  projectName = null;
  columnDefs = [
    { headerName: 'ID', field: 'Id', hide: "false" },
    { headerName: 'Project Name', field: 'Project_Name' },
    { headerName: 'Deactivate Reason', field: 'Deactivate_Reason' },
    { headerName: 'Created Date', field: 'Created_Date' },
    { headerName: 'Status', field: 'Status', cellRenderer: this.statufFormatter },
    { headerName: 'Action', field: 'Status', cellRenderer: this.ActionCellRendererClass }
  ]
  gridApi;
  gridColumnApi;
  rowSelection = "single";
  openProjectModal = false;
  activeProject = null;
  httpStatus = false;
  constructor(private projectandpriorityService: ProjectandpriorityService, private notificationservice: NotificationService) {
    this.ResponseHelper = new ResponseHelper(this.notificationservice);
  }

  ngOnInit() {
    this.getClientProjectList();
  }
  statufFormatter(params) {
    console.log('statufFormatter : ', params);
    return params.value == true ? 'Active' : 'De-Active';
  }

  getClientProjectList() {

    this.projectandpriorityService.getClientProjectList(this.ClientData.Id).subscribe((response) => {
      console.log('getClientProjectList response: ', response);
      this.rowData = response.Data;

      this.rowData.forEach((row) => {
        row.Deactivate_Reason = (row.Deactivate_Reason == null || row.Deactivate_Reason.length == 0) ? "N/A" : row.Deactivate_Reason;
      });
    }, (error) => {
      this.rowData = [];
      console.log('getClientProjectList error: ', error);
    });
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.columnApi.autoSizeColumns();
  }
  nextPage() {
    this.next_page.emit('saag');
  }

  addProject() {
    if (this.projectName == null || this.projectName.length == 0) {
      return false;
    }
    this.httpStatus = true;
    this.projectandpriorityService.addProject({ Project_Name: this.projectName, "Client_Id": this.ClientData.Id }).subscribe((response) => {
      console.log('addProject response : ', response);
      this.projectName = null;
      this.httpStatus = false;
      this.ResponseHelper.GetSuccessResponse(response);
      this.getClientProjectList();
    }, (error) => {
      this.ResponseHelper.GetFaliureResponse(error);
      this.httpStatus = false;
      console.log('addProject error : ', error);
    })
  }
  onCellClicked(event) {
    console.log('onCellClicked : ', event);
    const { data } = event;
    if (data && data.Status == true) {
      console.log('Status : ', data.Status);
      this.openProjectModal = true;
    }
    this.activeProject = data;
  }
  closeModal() {
    this.openProjectModal = false;
    this.getClientProjectList();
  }
  navigate() {
    this.next_page.emit('special_project')
  }

  ActionCellRendererClass(params) {
    let val
    let eDiv = document.createElement('div');
    // params.value = false;
    if (params && params.value == true) {
      val = "De-Activate";
      eDiv.innerHTML = '<button  class="btn label gray label-info square-btn cursor " data-action-type="update">' + val + '</button>';
    } else {
      val = 'De-Active';
      eDiv.innerHTML = '<button disabled class="btn label square-btn cursor" style="color:#000;font-size: 13px;font-weight: normal;padding: 3px 5px;width: 80px;float: left;border: 1px solid gray;">' + val + '</button>';
    }
    return eDiv;
  }
}

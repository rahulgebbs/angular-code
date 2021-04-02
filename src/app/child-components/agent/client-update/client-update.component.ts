import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { AgentService } from 'src/app/service/agent.service';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
import * as moment from 'moment';
import { SelectBoxComponent } from 'src/app/ag-grid/select-box/select-box.component';

@Component({
  selector: 'app-client-update',
  templateUrl: './client-update.component.html',
  styleUrls: ['./client-update.component.css']
})
export class ClientUpdateComponent implements OnInit {
  @Output() Toggle = new EventEmitter<any>();
  @Output() getCount = new EventEmitter<any>();
  @Input() ClientUpdateData;
  @Input() UserId;
  gridApi;
  ResponseHelper;
  gridColumnApi;
  rowSelection = "single";
  defaultColDef
  columnDefs = [
    { headerName: 'Created/Modified Date', field: 'Created_Date', cellRenderer: this.DateFormat },
    { headerName: 'Payer Name', field: 'Payer_Name' },
    { headerName: 'Practice Name', field: 'Practice_Name' },
    { headerName: 'Provider Name', field: 'Provider_Name' },
    { headerName: 'Instructions', field: 'Instructions' },
    { headerName: 'Active/De-Active', field: 'Is_Active', cellRenderer: this.MyCustomCellRendererClass },
    { headerName: 'Status', field: 'Type' },
    { headerName: 'Action', field: 'Is_Read_By_Agent', cellRenderer: this.ActionCellRendererClass },
    /*
    commented for release
    */
    // {
    //   headerName: "Action",
    //   field: 'Is_Read_By_Agent',
    //   cellRenderer: 'selectCellRenderer',
    // }
  ];
  frameworkComponents;
  showClientInstructionCommentModal
  constructor(private service: AgentService, private notificationservice: NotificationService) {
    this.ResponseHelper = new ResponseHelper(this.notificationservice);
  }
  activeRow = null;
  ngOnInit() {
    this.frameworkComponents = {
      selectCellRenderer: SelectBoxComponent,
    };
    this.defaultColDef = {
      cellRenderer: showOrderCellRenderer,
      resizable: false
    };
    function showOrderCellRenderer(params) {
      var cell: any = document.createElement("div");
      console.log('params : ', params)

      cell.innerHTML = `<div title="${params.value}">${params.value}</div>`;
      // var start = new Date();
      // while (new Date() - start < 15) { }
      return cell;
    }
  }
  closeModel() {
    this.Toggle.emit('');
  }
  onGridReady(params) {
    params.api.sizeColumnsToFit()
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
  onCellClicked(statusObj) {
    let updateVlue = {
      "Client_Id": statusObj.data.Client_Id,
      "Client_Instruction_Id": statusObj.data.Id,
      "Agent_Id": this.UserId
    }
    const { data } = statusObj;
    let actionType = statusObj.event.target.getAttribute("data-action-type");
    console.log('cellValueChanged data : ', data);
    /*
     commented for UAT
    this.showClientInstructionCommentModal = true;
    this.activeRow = data;
    switch (data.Read_By) {
      case true:
        {
          this.activeRow = 
          break;
        }
      case false:
        {
          break;
        }
      default:
        break;
    }
    */
    if (statusObj.colDef.headerName == "Action" && actionType == "update") {
      this.service.updateClientInstruction(updateVlue).subscribe(res => {
        this.ResponseHelper.GetSuccessResponse(res);
        statusObj = res.json();
        this.ClientUpdateData = statusObj.Data;
        this.getCount.emit('')
      }, err => {
        this.ResponseHelper.GetFaliureResponse(err);

      })
    }
  }

  DateFormat(params) {
    return moment(params.value).format('MM/DD/YYYY')
  }

  MyCustomCellRendererClass(params) {
    let val
    if (params.value) {
      val = 'Active'
    } else {
      val = "De-Active"
    }
    return val;
  }

  ActionCellRendererClass(params) {
    let val
    let eDiv = document.createElement('div');
    if (!params.value) {
      val = 'Accept'
      eDiv.innerHTML = '<button  class="btn label grey label-info square-btn cursor " data-action-type="update">' + val + '</button>';
    } else {
      val = "Accepted"
      eDiv.innerHTML = '<button  class="btn label grey label-info square-btn cursor"  disabled="" >' + val + '</button>';
    }
    return eDiv;
  }
  closeCommentModal() {
    console.log('client update : closeCommentModal');
    this.showClientInstructionCommentModal = false;
  }
}

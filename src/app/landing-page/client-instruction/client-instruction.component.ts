import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
import { Token } from 'src/app/manager/token';
import { finalize } from 'rxjs/operators';
import { ClientInstructionService } from 'src/app/service/client-instruction.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { dropDownFields } from 'src/app/manager/dropdown-feilds';

@Component({
  selector: 'app-client-instruction',
  templateUrl: './client-instruction.component.html',
  styleUrls: ['./client-instruction.component.css'],
  providers:[dropDownFields]
})
export class ClientInstructionComponent implements OnInit {
  Title = "Client Instruction";
  RowSelection = "single";
  ResponseHelper: ResponseHelper;
  UserId;
  ClientId;
  DisableClientList = true;
  DisableAll = false;
  saveDisable = false;
  ShowRoleError = false;
  ClientList: any[] = [];
  PayerList: any[] = [];
  PracticeList: any[] = [];
  ProviderList: any[] = [];
  InstructionId = 0;
  GridApi;
  RoleMessage;
  GridColumnApi;
  InstructionForm: FormGroup;
  InstructionModel = new InstructionModel();
  Validated = false;
  viewCountData: boolean = false;
  selec;
  flag: boolean = true
  singleclient: boolean = false
  paydata = 0;
  pracdata = 0
  prodata = 0
  showCount: boolean = true
  showGebbsAction: boolean = true
  readCountData = [];
  canEdit: boolean = true;
  ColumnDefs = []
  RowData = [];
  Role;
  selectedRecord: boolean = false;
  defaultColDef;
  constructor(private selectedFields:dropDownFields,private router: Router, private fb: FormBuilder, private notificationservice: NotificationService,  private instructionservice: ClientInstructionService) {
    var token = new Token(this.router);
    var userdata = token.GetUserData();
    this.UserId = userdata.UserId;
    this.Role = userdata.Role;
    switch (this.Role) {
      case "Client Supervisor":
        this.showGebbsAction = false
        break;
      case "Supervisor":
        this.showCount = false;
        break;
    }

    this.ColumnDefs = [
      { field: "Id", hide: true, rowGroupIndex: null },
      { field: "Client_Id", hide: true, rowGroupIndex: null },
      {
        headerName: "Payer Name", field: "Payer_Name", cellClass: "cell-wrap-text",
        autoHeight: true
        , cellStyle: { 'white-space': 'normal' }
      },
      { headerName: "Practice Name", field: "Practice_Name" },
      { headerName: "Provider Name", field: "Provider_Name" },
      {
        headerName: "Instructions", field: "Instructions", cellClass: "cell-wrap-text",
        autoHeight: true, cellStyle: { 'white-space': 'normal' }
      },
      { headerName: "Created / Modified Date", field: 'Updated_Date', cellRenderer: this.datecheck },
      { headerName: "Status", field: "Type" },
      { headerName: "Count", field: "Read_By_Agent_Count", width: 170, cellRenderer: this.ActionCellRendererClass, cellStyle: { cursor: 'pointer' }, hide: this.showCount },
      { headerName: "GeBBS Action", field: "Read_By", hide: this.showGebbsAction, cellRenderer: this.Action, },
    ];
  }

  ngOnInit() {
    this.defaultColDef = {
      cellRenderer: showOrderCellRenderer,
      // width: 80
    };
    function showOrderCellRenderer(params) {
      var eGui: any = document.createElement("div");
      // console.log('params : ', params)

      eGui.innerHTML = `<span title="${params.value}">${params.value}</span>`;
      // var start = new Date();
      // while (new Date() - start < 15) { }
      return eGui;
    }
    this.ResponseHelper = new ResponseHelper(this.notificationservice);
    var token = new Token(this.router);
    var userdata = token.GetUserData();
    this.UserId = userdata.UserId;
    this.InstructionForm = this.CreateForm();
    // this.GetClientList()
    this.ClientList = this.selectedFields.setSelected(userdata.Clients)
    this.selectedValue(this.ClientList, 'ClientList')

  }

  datecheck(params) {

    let val
    val = moment(params.value).format('MM/DD/YYYY');
    return val;
  }





  selectedValue(data, name) {
    if (data.length == 1 && data.length) {
      switch (name) {
        case 'PracticeList':
          this.InstructionModel.Practice_Name = data[0].Value;
          break;
        case 'ProviderList':
          this.InstructionModel.Provider_Name = data[0].Value
          break;
        case 'PayerList':
          this.InstructionModel.Payer_Name = data[0].Value
          break;
        case 'ClientList':
          this.ClientId = data[0].Client_Id
          this.InstructionModel.Client_Id = data[0].Client_Id;
          this.GetAllLookups();
          this.GetClientInstructions();
          break;

      }
      this.singleclient = true
    } else {

    }

  }

  CreateForm() {
    return this.fb.group({
      'Client': ['', Validators.required],
      'Payer': ['', Validators.required],
      'Provider': ['', Validators.required],
      'Practice': ['', Validators.required],
      'Instruction': ['', Validators.required],
      'IsActive': [false, Validators.required]
    })
  }

  OnGridReady(event) {
    //event.api.sizeColumnsToFit()
    //event.api.sizeColumnsToFit() 
    this.GridApi = event.api;
    this.GridColumnApi = event.columnApi;
    setTimeout(function () {
      event.api.resetRowHeights();
    }, 500);
  }

  onColumnResized(event) {
    if (event.finished) {
      this.GridApi.resetRowHeights();
    }
  }

  OnRowClicked(event) {
    this.selectedRecord = true
    this.ShowRoleError = false;
    this.InstructionId = event.data.Id;
    this.GetSingleClientInsurance();
  }
  onCellClicked(data) {

    if (data.colDef.headerName == "Count") {
      this.instructionservice.getCountData(this.ClientId, data.data.Id).pipe(finalize(() => {
        this.viewCountData = true
      })).subscribe(res => {
        this.ResponseHelper.GetSuccessResponse(res)
        data = res.json()
        this.readCountData = res.json()
        //  this.ClientUpdateData = data.Data
      }, err => {
        this.ResponseHelper.GetFaliureResponse(err);

      })
    }
  }
  ToggleModal(e) {
    this.viewCountData = false
  }
  AutoSizeGrid(event) {
    event.columnApi.autoSizeColumns(["Practice_Name", "Provider_Name", "Type", "GeBBS_Action"]);
  }



  ClientListOnChange(event) {

    this.ClearData();
    this.ShowRoleError = false;
    this.InstructionModel = new InstructionModel();
    if (!event.target.value || event.target.value == "0") {
      // this.DisableSearch = true;
    }
    else {
      this.ClientId = event.target.value;
      this.InstructionModel.Client_Id = this.ClientId;
      this.GetAllLookups();
      this.GetClientInstructions();

    }
  }

  GetAllLookups() {


    this.instructionservice.GetAllLookups(this.ClientId).pipe(finalize(() => {

    })).subscribe(
      res => {

        this.PayerList = this.selectedFields.setSelected(res.json().Data.Payer);
        this.PracticeList = this.selectedFields.setSelected(res.json().Data.Practice);
        this.ProviderList =this.selectedFields.setSelected( res.json().Data.Provider);
        this.selectedValue(this.PayerList, 'PayerList');
        this.selectedValue(this.PracticeList, 'PracticeList');
        this.selectedValue(this.ProviderList, 'ProviderList');
      },
      err => {
        this.ResponseHelper.GetFaliureResponse(err);
      }
    );
  }

  GetClientInstructions() {
    this.instructionservice.GetClientInstructions(this.ClientId).pipe(finalize(() => {
    })).subscribe(
      res => {

        this.RowData = res.json().Data
      },
      err => {
        this.RowData = [];
        this.ResponseHelper.GetFaliureResponse(err);
      }
    );
  }

  GetSingleClientInsurance() {
    this.instructionservice.GetSingleClientInstruction(this.ClientId, this.InstructionId).pipe(finalize(() => {
    })).subscribe(
      res => {
        this.ManageForEdit(res.json().Data);
        //this.InstructionModel = res.json().Data;
      },
      err => {

        this.InstructionModel = new InstructionModel();
        this.ResponseHelper.GetFaliureResponse(err);
      }
    );
  }

  ManageForEdit(ins) {

    if (this.Role == "Client Supervisor" && ins.Is_Client_Created == true) {
      this.canEdit = true;

    } else if (this.Role == "Supervisor" && ins.Is_Client_Created == false) {
      this.canEdit = true
    } else {
      this.canEdit = false
    }


    if (this.Role == "Client Supervisor" && ins.Created_By == this.UserId) {
      this.ShowRoleError = true;
      // this.RoleMessage = "Can be edited by Supervisor Only";
      this.InstructionModel = new InstructionModel();
      this.InstructionModel.Client_Id = this.ClientId;
      this.GridApi.deselectAll();
    }
    else if (this.Role == "QC" && this.UserId != ins.Created_By) {
      this.ShowRoleError = true;
      this.RoleMessage = "Your role can edit only self created instructions";
      this.InstructionModel = new InstructionModel();
      this.InstructionModel.Client_Id = this.ClientId;
      this.GridApi.deselectAll();
    } else if (this.Role == "Client Supervisor" && ins.Is_Client_Created) {

    }
    else {
      this.ShowRoleError = false;
      this.InstructionModel = ins;
    }
  }

  FormSubmit() {

    this.Validated = true;

    if (this.InstructionForm.valid) {
      if (this.InstructionModel.Id == 0) {
        //post

        this.InsertInstruction();
      }
      else {

        this.UpdateInstruction();
        //put
      }
    }
  }

  InsertInstruction() {

    this.DisableAll = true;
    this.saveDisable = true;
    this.instructionservice.InsertInstruction(this.InstructionModel).pipe(finalize(() => {
      this.DisableAll = false;
      this.saveDisable = false
    })).subscribe(
      res => {
        this.GetClientInstructions();
        this.ResponseHelper.GetSuccessResponse(res);
        this.InstructionModel = new InstructionModel();
        this.InstructionModel.Client_Id = this.ClientId;
        this.InstructionId = 0;
        this.Validated = false;

      },
      err => {
        this.ResponseHelper.GetFaliureResponse(err);
      }
    );
  }

  UpdateInstruction() {
    this.DisableAll = true
    this.saveDisable = true

    this.instructionservice.UpdateInstruction(this.InstructionModel).pipe(finalize(() => {
      this.DisableAll = false;
      this.saveDisable = false
    })).subscribe(
      res => {

        this.GetClientInstructions();
        this.ResponseHelper.GetSuccessResponse(res);
        this.InstructionModel = new InstructionModel();
        this.InstructionModel.Client_Id = this.ClientId;
        this.InstructionId = 0;
        this.Validated = false;

      },
      err => {
        this.ResponseHelper.GetFaliureResponse(err);
      }
    );
  }

  ClearData() {
    this.DisableAll = false;
    this.canEdit = true
    this.saveDisable = false
    this.selectedRecord = false;
    this.InstructionId = 0;
    this.DisableAll = false
    //  this.PayerList = [];
    //  this.PracticeList = [];
    //  this.ProviderList = [];
    this.InstructionModel = new InstructionModel();
    if (this.singleclient) {
      this.InstructionModel.Client_Id = this.ClientId
    } else {
      this.InstructionModel.Client_Id = "0"
    }

    this.RowData = [];
    this.Validated = false;
  }
  ActionCellRendererClass(params) {
    let val
    let eDiv = document.createElement('div');
    // if (!params.value) {
    val = params.value
    eDiv.innerHTML = '<u>' + val + '</u>';
    // } 
    return eDiv;
  }

  Action(params) {
    let val
    if (params.value == 0) {
      val = "No Action Taken"
    } else if (params.value == 1) {
      val = "Review Accepted"
    }
    return val;
  }

}

export class InstructionModel {

  constructor() {
    this.Id = 0;
    this.Client_Id = "";
    this.Payer_Name = "";
    this.Practice_Name = "";
    this.Provider_Name = "";
    this.Instructions = "";
    this.Type = "INACTIVE";
    this.Is_Active = false;
  }
  Id: number;
  Client_Id;
  Type;
  Is_Active: boolean;
  Payer_Name;
  Practice_Name;
  Provider_Name;
  Instructions;
  UpdatedDate;
}

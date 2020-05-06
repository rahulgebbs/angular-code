import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SaagService } from '../../../service/client-configuration/saag.service';
import { Token } from '../../../manager/token';
import { NotificationService } from 'src/app/service/notification.service';
import * as FileSaver from 'file-saver';
import { Router } from '@angular/router';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { ExcelService } from 'src/app/service/client-configuration/excel.service';
import { customValidation } from 'src/app/manager/customValidators';
import { dropDownFields } from 'src/app/manager/dropdown-feilds';



@Component({
  selector: 'app-pcn-configuration',
  templateUrl: './pcn-configuration.component.html',
  styleUrls: ['./pcn-configuration.component.css'],
  providers: [ExcelService, dropDownFields]

})
export class PcnConfigurationComponent implements OnInit {
  Popup: boolean = false
  saagData;
  addSaag: FormGroup;
  token: Token;
  userData;
  rowData;
  ResponseHelper;
  File;
  Filename = 'No File Chosen';
  FileBase64;
  saveAs: any;
  Status;
  SubStatus;
  ActionCode;
  saaglookup: any;
  Effectiveness_Matrix;
  Canned_Notes
  Follow_Up
  Findings_Insights
  Follow_Up_Days
  Client_Production
  fileSelected: boolean = true;
  validate: boolean = false
  update: boolean = false;
  validated: boolean = false;
  uploadBtnDisable: boolean = true;
  exportBtnDisable: boolean = false;
  downloadTemplateDisable: boolean = false;
  disableSave: boolean = false
  addBtnDisable;
  FollowupCondition;
  EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION = '.xlsx';
  @Input() ClientData;
  @Output() next_page = new EventEmitter<any>();
  columnDefs = [];
  gridApi;
  gridColumnApi;
  rowSelection = "single";
  gridOptions: any;

  constructor(private selecetedFields: dropDownFields, private excelService: ExcelService, private router: Router, public fb: FormBuilder, private service: SaagService, private notificationservice: NotificationService) {
    this.token = new Token(this.router);
    this.userData = this.token.GetUserData();

  }

  CreateSaagForm() {
    this.addSaag = this.fb.group({
      "Client_Id": [""],
      "Status": ["", Validators.compose([Validators.required, Validators.maxLength(500)])],
      "Sub_Status": ["", Validators.compose([Validators.required, Validators.maxLength(500)])],
      "Action_Code": ["", Validators.compose([Validators.required, Validators.maxLength(500)])],
      "Effectiveness_Matrix": ["", Validators.compose([Validators.required, Validators.maxLength(100)])],
      "Follow_Up": [false],
      "Client_Production": [false],
      "Follow_Up_Days": [0, Validators.compose([Validators.max(365), Validators.pattern('^[0-9]+([0]{365})?$')])],
      "Findings_Insights": ["", Validators.compose([Validators.required, Validators.maxLength(100)])],
      "Canned_Notes": ["", Validators.compose([Validators.required, Validators.maxLength(1000)])],
    })
  }

  ngOnInit() {
    this.getPCNList();
    this.ResponseHelper = new ResponseHelper(this.notificationservice);

    this.columnDefs = [
      { headerName: 'Dispaly Header', field: 'Dispaly_Header', editable: true },
      { headerName: 'Field Limit', field: 'Field_Limit', editable: true },
      {
        field: "Column_Data_Type",
        headerName: "Column Data Type",
        editable: true
      }]
    // function FieldRenderer(params) {
    //   console.log('FieldRenderer : ', params);
    //   return params.value;
    // }
  }


  ValCheck(params) {

    let val
    if (params.value) {
      val = 'Yes'
    } else {
      val = 'No'
    }
    return val;
  }
  exportCheck(val) {
    if (val) {
      val = 'Yes'
    } else {
      val = 'No'
    }
    return val;
  }

  MyCustomCellRendererClass(params) {
    let val
    if (params.value) {
      val = 'Active'
    } else {
      val = "De-Active"
    }
    var eDiv = document.createElement('div');
    eDiv.innerHTML = '<button type="button" class="btn-simple btn label grey label-info square-btn cursor mt-1" data-action-type="update"" style="left:100">' + val + '</button>';
    return eDiv;

  }

  isActive(val) {
    //  let val

    if (val) {
      val = 'Active'
    } else {
      val = "De-Active"
    }

    return val
  }


  onCellClicked(data) {
    let updateVlue = {
      "Id": data.data.Id,
      "Client_Id": data.data.Client_Id,
      "Is_Active": !data.data.Is_Active,
      "Updated_Date": data.data.Updated_Date
    }

    let actionType = data.event.target.getAttribute("data-action-type")
    if (data.colDef.headerName == "Active - Deactive" && actionType == "update") {
      this.service.updateSaag(updateVlue).subscribe(res => {
        this.ResponseHelper.GetSuccessResponse(res)
        this.getSaagDetail()
      }, err => {
        this.ResponseHelper.GetFaliureResponse(err)
      })
    }
  }
  getSaagDetail() {
    if (this.ClientData) {

      this.saagData = this.ClientData
      this.service.getSaggDetail(this.ClientData.Id).subscribe(data => {
        let res = data.json()
        this.rowData = res.Data
        this.saagData = res.Data
      }, err => {
        this.rowData = [];
        this.ResponseHelper.GetFaliureResponse(err)
      })
    }

  }

  validFollowup() {
    this.FollowupCondition = customValidation.validFollowupDays(this.addSaag.value.Follow_Up_Days, this.addSaag.value.Follow_Up)
  }
  submitFrom() {

    this.validate = true
    this.addSaag.value.Client_Id = this.ClientData.Id
    this.FollowupCondition = customValidation.validFollowupDays(this.addSaag.value.Follow_Up_Days, this.addSaag.value.Follow_Up)
    if (this.addSaag.valid && this.validate && this.FollowupCondition) {
      this.disableSave = true;
      this.service.addSagg(this.addSaag.value).subscribe(data => {
        this.ResponseHelper.GetSuccessResponse(data)
        this.Popup = false;
        this.clearForm();
        this.disableSave = false;
        this.ClientData.Is_SAAG_Uploaded = true;
      }, err => {
        this.disableSave = false;
        this.ResponseHelper.GetFaliureResponse(err)
      })
    }
  }
  nextPage() {
    this.next_page.emit('saag');
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.columnApi.autoSizeColumns();
  }
  downloadFile(data) {
    let file = URL.createObjectURL(data);
    FileSaver.saveAs(file);
  }
  downloadTemplate() {
    this.downloadTemplateDisable = true
    this.service.downloadTemplate().subscribe(res => {
      this.downloadTemplateDisable = false
      this.excelService.downloadExcel(res)
    }, err => {
      this.downloadTemplateDisable = false
      this.ResponseHelper.GetFaliureResponse(err)
    })
  }


  changeListener(event): void {
    if (event.target.files && event.target.files.length > 0) {
      this.validated = false
      this.File = event.target.files[0];
      this.Filename = this.File.name;
      this.fileSelected = true
      this.uploadBtnDisable = false
      this.ConvertToBase64()
    }
    else {
      this.Filename = 'No File Chosen'
      this.File = null;
      this.validated = true
      this.FileBase64 = null;
    }
  }

  getSaagLookup() {

    this.Status = [];
    this.service.getEFM().subscribe(data => {
      this.saaglookup = data.json().Data;
      let a = this.saaglookup.map(function (obj) { return obj.Effectiveness_Matrix_Name })
      this.Effectiveness_Matrix = []
      this.Effectiveness_Matrix = a.filter(function (x, i, a) {
        return a.indexOf(x) == i;
      });
    }, err => {
      this.ResponseHelper.GetFaliureResponse(err)
    })

  }

  ConvertToBase64() {
    let reader = new FileReader();
    reader.readAsDataURL(this.File);
    reader.onload = () => {
      this.FileBase64 = reader.result.toString().split(',')[1];
    }
  }

  FileUpload() {


    this.validated = true

    if (this.Filename != 'No File Chosen') {
      this.fileSelected = true
    } else {
      this.fileSelected = false
    }
    this.uploadBtnDisable = true
    let dataobj = { File: this.FileBase64, File_Name: this.Filename, Client_Id: this.ClientData.Id };
    if (this.fileSelected) {
      this.service.uploadSaag(dataobj).subscribe(res => {
        this.validated = false
        this.fileSelected = false
        this.Filename = "No File Chosen"
        this.ResponseHelper.GetSuccessResponse(res)
        this.ClientData.Is_SAAG_Uploaded = true;
      },
        err => {

          this.ResponseHelper.GetFaliureResponse(err)
        }
      );
    }
  }

  exportToExcel() {

    this.exportBtnDisable = true
    var exportData = [];

    this.rowData.forEach((el) => {
      var obj = new Object()
      obj['Status'] = el.Status;
      obj['SubStatus'] = el.Sub_Status;
      obj['Action Code'] = el.Action_Code;
      obj['Effectiveness Matrix'] = el.Effectiveness_Matrix;
      obj['Follow Up'] = this.exportCheck(el.Follow_Up);
      obj['Client Production'] = this.exportCheck(el.Client_Production);
      obj['Follow Up Days'] = el.Follow_Up_Days;
      obj['Finding / Insights'] = el.Findings_Insights;
      obj['Canned Notes'] = el.Canned_Notes;
      obj['Active-Deactive'] = this.isActive(el.Is_Active);
      exportData.push(obj);
    })
    this.excelService.exportAsExcelFile(exportData, 'Saag-Export');
    this.exportBtnDisable = false
  }
  showPopup() {
    this.CreateSaagForm();
    this.getSaagLookup();
    this.Popup = !this.Popup
  }
  CloseModal() {
    this.Popup = false
    this.clearForm()
  }
  clearForm() {
    this.addSaag.reset();
    this.validate = false
  }

  navigate() {
    this.next_page.emit('saag')
  }

  getPCNList() {
    const responseObj = {
      "Client_Id": "3035",
      "Client_PCN_Configuration_List": [

        {
          "Id": "0",
          "Dispaly_Header": "Balance",
          "Column_Data_Type": "Numeric",
          "Field_Limit": "50"
        },
        {
          "Id": "0",
          "Dispaly_Header": "DOS",
          "Column_Data_Type": "Date",
          "Field_Limit": "0"
        },
        {
          "Id": "0",
          "Dispaly_Header": "Charge",
          "Column_Data_Type": "Numeric",
          "Field_Limit": "0"
        },
        {
          "Id": "0",
          "Dispaly_Header": "remark",
          "Column_Data_Type": "Text",
          "Field_Limit": "29"
        }

      ]

    }
    this.rowData = responseObj.Client_PCN_Configuration_List;
    // responseObj.Client_PCN_Configuration_List.forEach((element) => {
    //   let obj = {};
    //   obj[element.Dispaly_Header] = element.Field_Limit;
    //   this.rowData.push(obj);
    // })

  }
}

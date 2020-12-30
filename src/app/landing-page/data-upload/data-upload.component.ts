import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/service/common-service';
import { Token } from 'src/app/manager/token';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
import { DataUploadService } from 'src/app/service/data-upload.service';
import { finalize } from 'rxjs/operators';
import { ExcelService } from 'src/app/service/client-configuration/excel.service'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { dropDownFields } from 'src/app/manager/dropdown-feilds';
import * as _ from 'lodash'
@Component({
  selector: 'app-data-upload',
  templateUrl: './data-upload.component.html',
  styleUrls: ['./data-upload.component.css'],
  providers: [ExcelService, dropDownFields]
})
export class DataUploadComponent implements OnInit {
  Title = "Inventory Upload";
  UserId;
  ResponseHelper;
  ClientId;
  ClientList: any[] = [];
  DisableFileInput = true;
  DisableUpload: boolean = true;
  disableDownload: boolean = true;
  dataUpload: FormGroup;
  DisplayFileError = false;
  Filename = "No File chosen";
  File = null;
  FileBase64;
  selected: boolean = false;
  singleclient: boolean = false;
  truefile: boolean = false;
  projectList = [];
  ShowModal = false;
  EmployeeString = '';
  Employees = [];
  concluderError = false;
  constructor(private selectField: dropDownFields, private fb: FormBuilder, private excelService: ExcelService, private router: Router, private commonservice: CommonService, private notificationservice: NotificationService, private service: DataUploadService) {
    this.dataUpload = this.fb.group({
      "Client_Id": ["", Validators.required],
      "type": [null, Validators.required],
      'EmpCode': [null, Validators.required],
      "Module_Name": [null, Validators.required]
    })
  }

  ngOnInit() {
    let token = new Token(this.router);
    var userdata = token.GetUserData();
    this.UserId = userdata.UserId;
    this.ResponseHelper = new ResponseHelper(this.notificationservice);
    this.ClientList = this.selectField.setSelected(userdata.Clients);
    if (this.ClientList[0].selected == true) {
      this.ClientId = this.ClientList[0].Client_Id
      this.DisableFileInput = false
      this.DisableUpload = false;
      this.disableDownload = false
      this.singleclient = true;
      this.dataUpload.patchValue({ 'Client_Id': this.ClientId });
      this.getEmployeeList();
      this.getModuleList();
    } else {
      this.DisableUpload = true;
      this.disableDownload = true;
      this.singleclient = false;
    }
  }

  getEmployeeList() {
    this.service.getEmployeeList(this.ClientId).subscribe((response) => {
      console.log('getEmployeeList response : ', response);
      this.Employees = (response && response.Data) ? response.Data : [];
      // this.ResponseHelper.GetSuccessResponse(response);
    }, (error) => {
      console.log('getEmployeeList error : ', error)
      this.ResponseHelper.GetFaliureResponse(error);
    });
  }

  getModuleList() {
    this.projectList = [];
    const { value } = this.dataUpload;
    if (value && value.Client_Id) {
      this.service.getModuleList(value.Client_Id).subscribe((response) => {
        this.projectList = (response && response.Data) ? response.Data : [];
        console.log('getModuleList response : ', response);
        // this.ResponseHelper.GetSuccessResponse(response);
      }, (error) => {
        this.projectList = [];
        console.log('getModuleList error : ', error);
        this.ResponseHelper.GetFaliureResponse(error);
      });
    }
  }

  selectedValue(data) {

    if (data.length && data.length == 1) {

      data[0].selected = true;
      this.ClientId = data[0].Client_Id
      this.DisableFileInput = false
      this.DisableUpload = false;
      this.disableDownload = false;
      this.singleclient = true;

    } else {
      this.DisableUpload = true;
      this.disableDownload = true;
      this.singleclient = false;
    }

  }



  ClientListOnChange(event) {
    if (!event.target.value || event.target.value == "") {
      this.DisableFileInput = true;
      this.DisableUpload = true;
      this.disableDownload = true
      this.ClearFileData();
    }
    else {
      this.DisableFileInput = false;
      this.DisableUpload = false;
      this.disableDownload = false
      this.ClientId = event.target.value;
    }
    this.getEmployeeList();
    this.getModuleList();
  }

  ClearFileData() {
    this.File = null
    this.Filename = "No File Chosen";
    this.FileBase64 = null;
    this.CloseModal();
  }

  GetFileData(event) {

    // let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      this.truefile = true
      this.File = event.target.files[0];
      this.Filename = this.File.name;
      this.ConvertToBase64()
    }
    else {
      this.truefile = false
      this.ClearFileData();
    }
  }

  ConvertToBase64() {
    let reader = new FileReader();
    reader.readAsDataURL(this.File);
    reader.onload = () => {
      this.FileBase64 = reader.result.toString().split(',')[1];
    }
  }


  FileUpload() {
    if (this.File != null) {
      // this.DisplayFileError = false;
      // this.DisableUpload = true;
      // this.DisableFileInput = true;
      let dataobj = { File: this.FileBase64, File_Name: this.Filename, Client_Id: this.ClientId };
      console.log('dataobj : ', dataobj);
      const formValue = this.dataUpload.value;
      console.log('formValue : ', formValue);
      if (formValue && formValue.type == 'concluder') {
        this.DisplayFileError = false;
        this.DisableUpload = true;
        this.DisableFileInput = true;
        this.uploadInventoryForConcluder(dataobj);
        // return null;
      }
      else if (formValue && formValue.type == 'project') {
        const { EmpCode, Module_Name } = formValue;
        dataobj['EmpCode'] = formValue['EmpCode'];
        dataobj['Module_Name'] = formValue['Module_Name'];
        console.log('if P&P : ', dataobj);
        this.concluderError = false;
        if (EmpCode != null && EmpCode.length > 0 && Module_Name != null && Module_Name.length > 0) {
          this.DisplayFileError = false;
          this.DisableUpload = true;
          this.DisableFileInput = true;
          this.uploadProjectAndPriority(dataobj)
        }
        else {
          this.concluderError = true;
        }
      }
      else {
        this.DisplayFileError = false;
        this.DisableUpload = true;
        this.DisableFileInput = true;
        this.service.InventoryDataUpload(dataobj).pipe(finalize(() => {
          this.DisableUpload = false;
          this.Filename = null;
          this.File = null;
          if (this.ClientList.length == 1) {
            this.disableDownload = false
          } else {
            this.disableDownload = true
          }
          this.DisableFileInput = false;
          this.ClearFileData();
          if (!this.singleclient) {
            this.ClientId = "";
          }
          // this.Is_Special_Queue = false;
        })).subscribe(
          res => {
            this.truefile = false
            this.ResponseHelper.GetSuccessResponse(res)
          },
          err => {
            this.truefile = false;
            this.truefile = false;
            this.DisableUpload = false;
            this.ResponseHelper.GetFaliureResponse(err)
          }
        );
      }
    }
    else {
      this.DisplayFileError = true;
    }
  }

  uploadProjectAndPriority(body) {
    this.service.projectAndPriorityUpload(body).pipe(finalize(() => {
      this.DisableUpload = false;
      this.Filename = null;
      this.File = null;
      if (this.ClientList.length == 1) {
        this.disableDownload = false
      } else {
        this.disableDownload = true
      }
      this.DisableFileInput = false;
      this.ClearFileData();
      if (!this.singleclient) {
        this.ClientId = "";
      }
      this.EmployeeString = '';
      this.dataUpload.patchValue({ 'type': '', 'EmpCode': [] })
      // this.Is_Special_Queue = false;
    })).subscribe(
      (response: any) => {
        console.log('ConcluderDataUpload :', response);
        this.truefile = false;
        let notifydata = response.Message ? response.Message : response.json().Message;
        notifydata.forEach((element) => {
          element.time = 5000;
        })
        this.notificationservice.ChangeNotification(notifydata);
        // this.ResponseHelper.GetSuccessResponse(res);
      },
      err => {
        this.truefile = false;
        this.DisableUpload = false;
        this.ClearFileData();
        console.log('error : ', err);
        this.ResponseHelper.GetFaliureResponse(err)
      }
    );
  }
  downloadTemplate() {
    this.service.downloadInventoryTemplate(this.ClientId).subscribe(res => {
      // let data = res.json().Data;
      this.excelService.exportAsExcelFile(res.Data, 'InventoryTemplate');
    }, err => {
      this.ResponseHelper.GetFaliureResponse(err);
    })
  }

  openModal(event) {
    console.log('OpenByAgent : ', this.dataUpload.value);
    this.dataUpload.patchValue({ 'EmpCode': [], 'Module_Name': '' });
  }

  closeModal(event) {
    console.log('closeModal event : ', event)
    this.dataUpload.patchValue({ type: null });
  }

  uploadInventoryForConcluder(dataObj) {
    console.log('uploadInventoryForConcluder : ', dataObj);
    // return null;
    dataObj['Is_Special_Queue'] = true;
    this.service.ConcluderDataUpload(dataObj).pipe(finalize(() => {
      this.DisableUpload = false;
      this.Filename = null;
      this.File = null;
      if (this.ClientList.length == 1) {
        this.disableDownload = false
      } else {
        this.disableDownload = true
      }
      this.DisableFileInput = false;
      this.ClearFileData();
      if (!this.singleclient) {
        this.ClientId = "";
      }
      // this.Is_Special_Queue = false;
    })).subscribe(
      res => {
        console.log('ConcluderDataUpload :', res);
        this.truefile = false;
        this.ResponseHelper.GetSuccessResponse(res)
      },
      err => {
        this.truefile = false;
        this.DisableUpload = false;
        this.ClearFileData();
        console.log('error : ', err);
        this.ResponseHelper.GetFaliureResponse(err)
      }
    );
  }
  SetSelectedEmp(event) {
    console.log('event : ', event);
    this.EmployeeString = "";
    this.ShowModal = false;
    event.forEach(e => {
      let name = e.Employee_Code + " " + e.Full_Name;
      this.EmployeeString += name;
      this.EmployeeString += (", ");
    })
    this.EmployeeString = this.EmployeeString.substring(0, this.EmployeeString.length - 2);
    this.dataUpload.patchValue({ 'EmpCode': _.map(event, 'Id') });
    this.ShowModal = false;
  }

  CloseModal() {
    this.ShowModal = false;
    this.dataUpload.patchValue({ 'EmpCode': [] });
    this.Employees.forEach((e: any) => {
      e.Is_Selected = false;
    });
    this.EmployeeString = '';
  }

  BlockInput(event) {
    // if (event.key == 'Backspace' || event.key == 'Tab') {
    //   return true;
    // }
    // else {
    return false;
    // }
  }

  OpenModal() {
    this.ShowModal = true;
  }

}

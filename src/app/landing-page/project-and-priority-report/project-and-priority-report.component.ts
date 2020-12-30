import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
import { Token } from 'src/app/manager/token';
import { SimpleReportService } from 'src/app/service/simple-report.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import * as moment from 'moment';
import { dropDownFields } from 'src/app/manager/dropdown-feilds';
import { ExcelService } from 'src/app/service/client-configuration/excel.service';
import { ConcluderService } from 'src/app/service/concluder.service';
import { ProjectandpriorityService } from 'src/app/service/projectandpriority.service';

@Component({
  selector: 'app-project-and-priority-report',
  templateUrl: './project-and-priority-report.component.html',
  styleUrls: ['./project-and-priority-report.component.css'],
  providers: [ExcelService, dropDownFields]
})
export class ProjectAndPriorityReportComponent implements OnInit {

  validationError: boolean = false
  Title = "Project & Priority Reports";
  ShowModal = false;
  ClientId: number = 0;
  UserId: number;
  SelectedProjects = [];
  ProjectString = "";
  DisableProjectSelect = true;
  ClientList: any[] = [];
  ResponseHelper: ResponseHelper;
  Projects = [];
  DisplayError = false;
  MinDate1: Date = new Date('01/01/1990');
  MinDate2: Date = new Date('01/01/1990');
  maxDate1: Date;
  FromDate: Date = new Date();
  ToDate: Date = new Date();
  Role;
  ConcluderForm: FormGroup;
  token: Token
  only_worked: boolean = false
  isChecked
  fromtime
  disablesubmit: boolean = true;
  singleclient: boolean = false
  DonwloadConfig: boolean = false;

  constructor(private excelService: ExcelService, private selectField: dropDownFields, private router: Router, private notification: NotificationService, private simpleservice: SimpleReportService, private fb: FormBuilder, private concluderService: ConcluderService, private projectandpriorityService: ProjectandpriorityService) {
    this.ResponseHelper = new ResponseHelper(this.notification);
    this.maxDate1 = new Date(moment(new Date).format('YYYY-MM-DDT23:59'))
  }

  onGridReady(params) {
    params.columnApi.autoSizeColumns();
  }

  ngOnInit() {
    let token = new Token(this.router);
    var userdata = token.GetUserData();
    this.UserId = userdata.UserId;
    this.Role = userdata.Role;
    this.ClientList = this.selectField.setSelected(userdata.Clients);
    if (this.ClientList[0].selected == true) {
      this.disablesubmit = false

      this.ClientId = this.ClientList[0].Client_Id
      this.singleclient = true;
      this.ShowDownloadButton(this.ClientId);
    }
    this.selectedValue(this.ClientList)

    this.SetDateByRole();
    this.CreateForm();
  }

  selectedValue(data) {

    if (data.length == 1 && data.length) {

      this.DisableProjectSelect = false;
      this.disablesubmit = false
      data[0].selected = true;
      this.ClientId = data[0].Client_Id
      this.singleclient = true;
      this.GetAllProject();
    } else {

    }

  }

  CreateForm() {
    if (!this.singleclient) {
      this.ConcluderForm = this.fb.group({

        'Client_Id': ['', Validators.required],
        'Project_Ids': ['', Validators.required],
        'From_Date': [this.FromDate],
        'To_Date': [this.ToDate, Validators.required],
        'From_Time': ['', Validators.required],
        'To_Time': ['', Validators.required],
        'Is_Only_Worked': [false, Validators.required],

      }
        // {
        //  validator: Validators.compose([customValidation.CompareTime])
        // }
      )
    } else {
      this.ConcluderForm = this.fb.group({
        'Client_Id': [this.ClientId, Validators.required],
        'Project_Ids': ['', Validators.required],
        'From_Date': [this.FromDate],
        'To_Date': [this.ToDate, Validators.required],
        'From_Time': ['', Validators.required],
        'To_Time': ['', Validators.required],
        'Is_Only_Worked': [false, Validators.required],

      }
      )
    }
  }

  SetDateByRole() {
    this.FromDate.setDate(this.FromDate.getDate() - 1);
    this.ToDate.setDate(this.ToDate.getDate());
    if (this.Role == "Supervisor") {
      this.MinDate1 = new Date();
      this.MinDate2 = new Date()
      this.MinDate1.setMonth(this.MinDate1.getMonth() - 4);
      this.MinDate2.setMonth(this.MinDate1.getMonth());
      this.MinDate2.setDate(this.MinDate1.getDate() + 1);
      this.MinDate2.setFullYear(this.MinDate1.getFullYear())
    }
  }

  OpenModal() {
    this.ShowModal = true;
  }

  resetForm() {
    this.ConcluderForm.reset({
      ClientId: this.ClientList[0].Client_Id,
      Project_Ids: '',
      From_Date: this.FromDate,
      To_Date: this.ToDate,
      From_Time: '',
      To_Time: '',
      Is_Only_Worked: false
    });
  }

  CloseModal() {
    this.ShowModal = false;
    this.Projects.forEach(e => {
      if (e.Is_Selected && !e.Is_Old) {
        e.Is_Selected = false;
      }
      if (!e.Is_Selected && e.Is_Old) {
        e.Is_Selected = true;
      }
    })
  }


  GetAllProject() {
    this.projectandpriorityService.getProjectListByClientID(this.ClientId).subscribe((response) => {
      console.log('getProjectListByClientID response : ', response);
      this.Projects = response.Data;
      this.Projects.forEach(e => {
        e.Is_Selected = false;
      });
    }, (error) => {
      this.Projects = [];
      console.log('getProjectListByClientID response : ', error);
    });
  }

  OnFromDateChange(event) {
    this.getFromTime()
    // console.log(event)
    if (event.value > this.ToDate) {
      let todate = new Date(event.value);
      todate.setDate(todate.getDate() + 1)
      let date = new Date(event.value);
      this.ConcluderForm.patchValue({ 'To_Date': todate, 'From_Date': date })
    } else {
      let date = new Date(event.value);
      let todate = new Date()
      this.ConcluderForm.patchValue({ 'To_Date': todate, 'From_Date': date })
    }
  }

  OnToDateChange(event) {
    this.getFromTime()
    // console.log(event)
    if (event.value < this.FromDate) {
      let date = new Date(event.value)
      date.setDate(date.getDate() - 1);
      let todate = new Date(event.value);
      // this.MisForm.patchValue({ 'To_Date': todate })
      this.ConcluderForm.patchValue({ 'To_Date': todate })
    }
  }

  BlockInput(event) {
    if (event.key == 'Backspace' || event.key == 'Tab') {
      return true;
    }
    else {
      return false;
    }

  }


  ClientListOnChange(event) {

    this.disablesubmit = false
    this.ConcluderForm.patchValue({ 'Project_Ids': '' });
    const { value } = this.ConcluderForm;
    if (value.Client_Id == null || value.Client_Id == "0") {
      this.DisableProjectSelect = true;
    }
    else {
      this.ClientId = event.target.value;
      this.DisableProjectSelect = false;
      this.GetAllProject();
      // this.ShowDownloadButton(this.ClientId);
    }
    this.ProjectString = "";
    this.SelectedProjects = [];
    this.Projects.forEach(e => {
      e.Is_Selected = false;
      e.Is_Old = false;
    })
  }

  ShowDownloadButton(ClientId) {
    // this.simpleservice.ReportDownloadConfig(ClientId).subscribe(
    //   res => {
    //     //var abc =res.json().Data;
    //     this.DonwloadConfig = res.json().Data.Is_Simple_Report_Download;
    //     console.log(res.json().Data.Is_Simple_Report_Download);
    //   },
    //   err => {
    //     this.ResponseHelper.GetFaliureResponse(err);
    //   })
  }

  // GetSimpleReportData() {
  //   if (this.ConcluderForm.valid) {
  //     this.DisplayError = false;
  //     this.ConcluderForm.value.From_Date = moment(this.ConcluderForm.value.From_Date).format('YYYY-MM-DD')
  //     this.ConcluderForm.value.To_Date = moment(this.ConcluderForm.value.To_Date).format('YYYY-MM-DD')
  //     // console.log(this.ConcluderForm.value);

  //     this.simpleservice.GetReportDownload(this.ConcluderForm.value).pipe(finalize(() => {
  //       this.ProjectString = "";
  //       this.CreateForm();
  //       //this.resetForm();
  //     })).subscribe(
  //       res => {
  //         this.excelService.downloadExcel(res)
  //         this.ResponseHelper.GetSuccessResponse(res);
  //         this.disablesubmit = true
  //       },
  //       err => {
  //         console.log('error');
  //         this.ResponseHelper.GetFaliureResponse(err);
  //       }
  //     )
  //   }
  //   else {
  //     this.DisplayError = true;
  //   }
  // }

  SetSelectedProject(event) {
    this.ConcluderForm.patchValue({ 'Project_Ids': '' })
    this.ProjectString = "";
    this.SelectedProjects = event;
    this.ShowModal = false;
    this.SelectedProjects.forEach(e => {
      let name = e.Project_Name; //+ " " + e.Full_Name;
      this.ProjectString += name;
      this.ProjectString += (", ");

    })
    this.ProjectString = this.ProjectString.substring(0, this.ProjectString.length - 2);
    let projectList = [];
    this.SelectedProjects.forEach(e => {
      projectList.push(e.Project_Name);
    });
    this.ConcluderForm.patchValue({ 'Project_Ids': projectList });
  }

  ExportToExcel() {
    console.log('ExportToExcel() : ', this.ConcluderForm.value);
    if (this.ConcluderForm.value.From_Time == "" && this.ConcluderForm.value.Project_Ids != "") {
      this.ConcluderForm.patchValue({ 'From_Time': "0:00" })
      this.ConcluderForm.patchValue({ 'To_Time': "0:00" })
      this.exportFunction()
      this.Projects.forEach(e => {
        e.Is_Selected = false;
      })
    }
    else {
      this.exportFunction();
    }
  }

  exportFunction() {

    if (this.ConcluderForm.valid) {
      this.DisplayError = false;
      this.ConcluderForm.value.From_Date = moment(this.ConcluderForm.value.From_Date).format('YYYY-MM-DD')
      this.ConcluderForm.value.To_Date = moment(this.ConcluderForm.value.To_Date).format('YYYY-MM-DD')
      // console.log('exportFunction : ', this.ConcluderForm.value);
      const finalObj = this.ConcluderForm.value;
      finalObj.Project_Name = JSON.parse(JSON.stringify(finalObj.Project_Ids));
      delete finalObj.Project_Ids
      console.log('finalObj : ', finalObj);
      this.projectandpriorityService.getPNPReport(finalObj).pipe(finalize(() => {
        this.ProjectString = "";
        this.CreateForm();
      })).subscribe(
        res => {
          console.log('GetConcluderReport : ', res)
          this.ResponseHelper.GetSuccessResponse(res);
          this.disablesubmit = true;
        },
        err => {
          this.ResponseHelper.GetFaliureResponse(err);
        }
      )
    }
    else {
      this.DisplayError = true;
    }
  }

  getFromTime() {

    let startDate = moment(this.ConcluderForm.value.From_Date).format('YYYY-MM-DD');
    let endDate = moment(this.ConcluderForm.value.To_Date).format('YYYY-MM-DD');
    let startTime = startDate + " " + this.ConcluderForm.value.From_Time;
    let endTime = endDate + " " + this.ConcluderForm.value.To_Time
    startTime = moment(startTime).format('YYYY-MM-DDTHH:mm');
    endTime = moment(endTime).format('YYYY-MM-DDTHH:mm');
    if (startTime < endTime) {
      this.validationError = false
    } else {
      this.validationError = true
    }
  }

  function(event) {
    if (event.target.checked) {
      this.only_worked = true
    } else {
      this.only_worked = false

    }
  }

}
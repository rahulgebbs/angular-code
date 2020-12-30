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
import { element } from '@angular/core/src/render3/instructions';
@Component({
  selector: 'app-client-supervisor-simple-report',
  templateUrl: './client-supervisor-simple-report.component.html',
  styleUrls: ['./client-supervisor-simple-report.component.css'],
  providers: [ExcelService, dropDownFields]
})
export class ClientSupervisorSimpleReportComponent implements OnInit {
  validationError: boolean = false
  Title = "Client Simple Reports";
  ShowModal = false;
  // ClientId: number = 0;
  UserId: number;
  SelectedEmployees = [];
  // EmployeeString = "";
  DisableEmployeeSelect = true;
  ClientList: any[] = [];
  ResponseHelper: ResponseHelper;
  Employees = [];
  DisplayError = false;
  MinDate1: Date = new Date('01/01/1990');
  MinDate2: Date = new Date('01/01/1990');
  maxDate1: Date;
  FromDate: Date = new Date();
  ToDate: Date = new Date();
  Role;
  SimpleForm: FormGroup;
  token: Token
  only_worked: boolean = false
  isChecked
  fromtime
  disablesubmit: boolean = true;
  singleclient: boolean = false
  DonwloadConfig: boolean = false;


  constructor(private excelService: ExcelService, private selectField: dropDownFields, private router: Router, private notification: NotificationService, private simpleservice: SimpleReportService, private fb: FormBuilder) {
    this.ResponseHelper = new ResponseHelper(this.notification);
    this.maxDate1 = new Date(moment(new Date).format('YYYY-MM-DDT23:59'))
  }

  ngOnInit() {
    let token = new Token(this.router);
    var userdata = token.GetUserData();
    this.UserId = userdata.UserId;
    this.Role = userdata.Role;
    this.ClientList = this.selectField.setSelected(userdata.Clients);
    this.SetDateByRole();
    this.CreateForm();


  }

  selectedValue(data) {
    console.log('clientList : ', data);
    if (data.length > 0) {
      this.SimpleForm.patchValue({ Client_Id: data[0].Client_Id });
      this.DisableEmployeeSelect = false;
      const value = this.SimpleForm.value;
      console.log('form value : ', value);
      this.disablesubmit = false;
      this.singleclient = true;
      this.GetAllEmployees();
      this.ShowDownloadButton(value.Client_Id);
    }
  }

  CreateForm() {
    if (!this.singleclient) {
      this.SimpleForm = this.fb.group({

        'Client_Id': ['', Validators.required],
        'Employee_Ids': ['', Validators.required],
        'From_Date': [this.FromDate],
        'To_Date': [this.ToDate, Validators.required],
        'From_Time': ['0:00', Validators.required],
        'To_Time': ['23:00', Validators.required],
        'Is_Only_Worked': [false, Validators.required],
      }
        // {
        //  validator: Validators.compose([customValidation.CompareTime])
        // }
      )
    } else {
      this.SimpleForm = this.fb.group({
        'Client_Id': [null, Validators.required],
        'Employee_Ids': ['', Validators.required],
        'From_Date': [this.FromDate],
        'To_Date': [this.ToDate, Validators.required],
        'From_Time': ['0:00', Validators.required],
        'To_Time': ['23:00', Validators.required],
        'Is_Only_Worked': [false, Validators.required],
      });
    }
    this.selectedValue(this.ClientList);
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
    this.SimpleForm.patchValue({
      From_Date: this.FromDate,
      To_Date: this.ToDate,
      From_Time: '0:00',
      To_Time: '23:00',
      Is_Only_Worked: false
    });

  }

  CloseModal() {
    this.ShowModal = false;
    this.Employees.forEach(e => {
      if (e.Is_Selected && !e.Is_Old) {
        e.Is_Selected = false;
      }
      if (!e.Is_Selected && e.Is_Old) {
        e.Is_Selected = true;
      }
    })
  }


  GetAllEmployees() {
    const value = this.SimpleForm.value;
    this.simpleservice.GetAllEmployees(value.Client_Id).subscribe(
      res => {
        this.Employees = res.json().Data;
        console.log('getAllEmployees response: ', this.Employees, res.json());
        const emplloyeeList = [];
        this.Employees.forEach(e => {
          emplloyeeList.push(e.Id);
        });
        this.SimpleForm.patchValue({ Employee_Ids: emplloyeeList });
      },
      err => {
        console.log('getAllEmployees response: ', err);
        this.ResponseHelper.GetFaliureResponse(err)
      }
    )
  }

  OnFromDateChange(event) {
    this.getFromTime()
    // console.log(event)
    if (event.value > this.ToDate) {
      let todate = new Date(event.value);
      todate.setDate(todate.getDate() + 1)
      let date = new Date(event.value);
      this.SimpleForm.patchValue({ 'To_Date': todate, 'From_Date': date })
    } else {
      let date = new Date(event.value);
      let todate = new Date()
      this.SimpleForm.patchValue({ 'To_Date': todate, 'From_Date': date })
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
      this.SimpleForm.patchValue({ 'To_Date': todate })
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

    // this.disablesubmit = false
    // this.EmployeeString = "";
    // this.SelectedEmployees = [];
    // this.Employees.forEach(e => {
    //   e.Is_Selected = false;
    //   e.Is_Old = false;
    // })
    // this.SimpleForm.patchValue({ 'Employee_Ids': '' });
    // if (!event.target.value || event.target.value == "0") {
    //   this.DisableEmployeeSelect = true;
    // }
    // else {
    //   this.ClientId = event.target.value;
    //   this.DisableEmployeeSelect = false;
    //   this.GetAllEmployees()
    //   this.ShowDownloadButton(this.ClientId);
    // }
  }

  ShowDownloadButton(ClientId) {
    this.simpleservice.ReportDownloadConfig(ClientId).subscribe(
      res => {
        //var abc =res.json().Data;
        this.DonwloadConfig = res.json().Data.Is_Simple_Report_Download;
        console.log(res.json().Data.Is_Simple_Report_Download);
      },
      err => {
        // this.ResponseHelper.GetFaliureResponse(err);
      })
  }


  GetSimpleReportData() {
    if (this.SimpleForm.valid) {
      this.DisplayError = false;
      this.SimpleForm.value.From_Date = moment(this.SimpleForm.value.From_Date).format('YYYY-MM-DD')
      this.SimpleForm.value.To_Date = moment(this.SimpleForm.value.To_Date).format('YYYY-MM-DD')
      console.log(this.SimpleForm.value);

      this.simpleservice.GetReportDownload(this.SimpleForm.value).pipe(finalize(() => {
        // this.EmployeeString = "";
        this.CreateForm();
        //this.resetForm();
      })).subscribe(
        res => {
          this.excelService.downloadExcel(res)
          this.ResponseHelper.GetSuccessResponse(res);
          this.disablesubmit = true
        },
        err => {
          console.log('error');
          this.ResponseHelper.GetFaliureResponse(err);
        }
      )
    }
    else {
      this.DisplayError = true;
    }
  }

  SetSelectedEmp(event) {
    // this.SimpleForm.patchValue({ 'Employee_Ids': '' })
    // this.EmployeeString = "";
    // this.SelectedEmployees = event;
    // this.ShowModal = false;
    // this.SelectedEmployees.forEach(e => {
    //   let name = e.Employee_Code + " " + e.Full_Name;
    //   this.EmployeeString += name;
    //   this.EmployeeString += (", ");

    // })
    // this.EmployeeString = this.EmployeeString.substring(0, this.EmployeeString.length - 2);
    // let selectedId = [];
    // this.SelectedEmployees.forEach(e => {
    //   selectedId.push(e.Id)
    // });
    // this.SimpleForm.patchValue({ 'Employee_Ids': selectedId });
  }

  ExportToExcel() {

    if (this.only_worked) {

      this.exportFunction()

    } else {

      if (this.SimpleForm.value.From_Time == "" && this.SimpleForm.value.Employee_Ids != "") {
        this.SimpleForm.patchValue({ 'From_Time': "0:00" })
        this.SimpleForm.patchValue({ 'To_Time': "23:00" })
        this.exportFunction()

      } else {
        this.exportFunction()
      }
    }
  }

  exportFunction() {

    if (this.SimpleForm.valid) {

      this.DisplayError = false;
      this.SimpleForm.value.From_Date = moment(this.SimpleForm.value.From_Date).format('YYYY-MM-DD')
      this.SimpleForm.value.To_Date = moment(this.SimpleForm.value.To_Date).format('YYYY-MM-DD')
      console.log('exportFunction : ', this.SimpleForm.value);
      this.disablesubmit = true;
      this.simpleservice.GetReport(this.SimpleForm.value).pipe(finalize(() => {
        // this.EmployeeString = "";
        // this.CreateForm();
        this.resetForm();
      })).subscribe(
        res => {

          this.ResponseHelper.GetSuccessResponse(res);
          this.disablesubmit = false;
        },
        err => {
          this.ResponseHelper.GetFaliureResponse(err);
          this.disablesubmit = false;
        }
      );
    }
    else {
      this.DisplayError = true;
    }
  }

  getFromTime() {

    let startDate = moment(this.SimpleForm.value.From_Date).format('YYYY-MM-DD');
    let endDate = moment(this.SimpleForm.value.To_Date).format('YYYY-MM-DD');
    let startTime = startDate + " " + this.SimpleForm.value.From_Time;
    let endTime = endDate + " " + this.SimpleForm.value.To_Time
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

  showCLientName() {
    const { value } = this.SimpleForm;
    console.log('showCLientName() : ', this.ClientList, value);
    if (value && value.Client_Id != null) {
      const matchedClient = this.ClientList.find(element => element.Client_Id == value.Client_Id);
      console.log('matchedClient : ', matchedClient);
      if (matchedClient && matchedClient.Client_Name) {
        return matchedClient.Client_Name;
      }
    }
    return "N/A";
  }
}

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NotificationService } from 'src/app/service/notification.service';
import { Router } from '@angular/router';
import { Token } from 'src/app/manager/token';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { CommonService } from 'src/app/service/common-service';
import { ClientApprovalService } from 'src/app/service/client-approval.service';
import { finalize } from 'rxjs/operators';
import { clientApproval } from 'src/app/service/client-approval';
import { ExcelService } from 'src/app/service/client-configuration/excel.service';



@Component({
  selector: 'app-client-approval',
  templateUrl: './client-approval.component.html',
  styleUrls: ['./client-approval.component.css'],
  encapsulation: ViewEncapsulation.None // Add this line
})
export class ClientApprovalComponent implements OnInit {

  Title = "Exceptions";
  ClientList = [];
  UserId = 0;
  ClientId = 0;
  Client_Name = '';
  ShowInventories = false;
  DisableSearch = false;
  ShowAging = false;
  ShowMain = false;
  MinDate: Date;
  FromDate: Date;
  ToDate: Date;
  Action = "Approve";

  ActionList = [
    { Key: "Pending", Value: "Approve" },
    { Key: "To Gebbs", Value: "To Gebbs" },
    { Key: "Hold", Value: "Hold" },
    { Key: "Close", Value: "Close" },
    { Key: "To Internal", Value: "To Internal" }
  ]
  // "Approve", "Deny", "Gebbs Close", "SAAG Change"];
  ResponseHelper: ResponseHelper;
  SelectedComment;
  SelectedHeader = '';
  CommentCount;
  Inventories = [];
  AgingData = [];
  SelectedAging;
  Summary;
  Comments = [];
  practiceList: any = [];
  activePracticeList = [];
  fieldSetting = {
    singleSelection: false,
    idField: 'Id',
    textField: 'Field_Name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 1,
    allowSearchFilter: true,
    noDataAvailablePlaceholderText: 'No Practice Name Found'

  };
  constructor(private router: Router, private notification: NotificationService, private commonservice: CommonService, private service: ClientApprovalService, private excelService: ExcelService) { }

  ngOnInit() {
    var tk = new Token(this.router);
    var userdata = tk.GetUserData();
    this.UserId = userdata.UserId;
    this.ClientId = userdata.Clients[0].Client_Id;
    this.Client_Name = userdata.Clients[0].Client_Name;
    this.ResponseHelper = new ResponseHelper(this.notification);
    this.MinDate = new Date('01/01/2000');
    //  this.GetClientList();
    this.getPracticeNameList();
  }
  // api/get-practice/9132

  getPracticeNameList() {
    this.service.getPracticeNameList(this.ClientId).subscribe((response) => {
      console.log('response : ', response);
      this.practiceList = response.Data.Practice.map((practice, index) => ({ Field_Name: practice, Id: index + 1 }));
    }, (error) => {
      console.log('error : ', error);
      this.practiceList = [];
    });
  }

  BlockInput(event) {
    if (event.key == 'Backspace' || event.key == 'Tab') {
      return true;
    }
    else {
      return false;
    }

  }

  OnActionChange() {
    this.ResetPage();
  }

  FromDateOnChange() {
    this.ResetPage();
  }

  ToDateOnChange() {
    this.ResetPage();
  }


  ResetPage() {
    this.ShowAging = false;
    this.ShowMain = false;
    this.ShowInventories = false;
    this.SelectedAging = null;
    this.SelectedComment = '';
  }

  Search() {
    console.log('Search() : ', this.activePracticeList);
    // Field_Name
    let practiceString = '';
    this.activePracticeList.forEach((element, index) => {
      if ((index + 1) < this.activePracticeList.length) {
        practiceString = practiceString + element.Field_Name + '|'
      }
      else {
        practiceString = practiceString + element.Field_Name;
      }
    });
    console.log('practiceString : ', practiceString);
    this.ShowAging = false;
    this.SelectedAging = null;
    this.DisableSearch = true;
    this.SelectedComment = '';
    this.service.GetSummaryAndComments(this.ClientId, this.ConvertDateFormat(this.FromDate), this.ConvertDateFormat(this.ToDate), this.Action, practiceString)
      .pipe(finalize(() => {
        this.DisableSearch = false;
      })).subscribe(
        res => {
          this.Summary = res.json().Data.Client_Summary;
          this.Comments = res.json().Data.Dispostion_Details;
          this.ShowMain = true;
          this.ResponseHelper.GetSuccessResponse(res);
        },
        err => {
          this.ShowMain = false;
          this.ResponseHelper.GetFaliureResponse(err);
        }
      )
  }

  GetAging(s) {
    if (s.StandardComment != this.SelectedComment) {
      let practiceString = '';
      this.activePracticeList.forEach((element, index) => {
        if ((index + 1) < this.activePracticeList.length) {
          practiceString = practiceString + element.Field_Name + '|'
        }
        else {
          practiceString = practiceString + element.Field_Name;
        }
      });
      this.service.GetAging(this.ClientId, this.Action, this.ConvertDateFormat(this.FromDate), this.ConvertDateFormat(this.ToDate), s.StandardComment, practiceString).subscribe(
        res => {
          this.SelectedComment = s.StandardComment;
          this.CommentCount = s.Count;
          this.AgingData = res.json().Data;
          this.ShowAging = true;
        },
        err => {
          this.ResponseHelper.GetFaliureResponse(err);
        }
      )
    }
  }

  enableSearch()
  {
    
  }
  GetInventories(a) {
    if (a.Count != "0") {
      let practiceString = '';
      this.activePracticeList.forEach((element, index) => {
        if ((index + 1) < this.activePracticeList.length) {
          practiceString = practiceString + element.Field_Name + '|'
        }
        else {
          practiceString = practiceString + element.Field_Name;
        }
      });
      this.service.GetInventories(this.ClientId, this.Action, this.ConvertDateFormat(this.FromDate), this.ConvertDateFormat(this.ToDate), this.SelectedComment, a.AgeingName, practiceString).subscribe(
        res => {
          this.SelectedAging = a;
          this.SelectedHeader = this.SelectedComment + ' (' + this.SelectedAging.AgeingName + ')'
          this.Inventories = res.json().Data;
          this.ToggleApprovalModal(false);
        },
        err => {
          this.ResponseHelper.GetFaliureResponse(err);
        }
      )
    }
  }

  ConvertDateFormat(date) {
    if (date) {
      return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear()
    }
    return "NA";
  }

  ToggleApprovalModal(event) {
    if (event == true) {
      this.ShowInventories = false;
      this.Search();
    }
    else {
      this.ShowInventories = !this.ShowInventories;
    }
  }

  getDataForExcel() {

    this.DisableSearch = true;
    let practiceString = '';
    this.activePracticeList.forEach((element, index) => {
      if ((index + 1) < this.activePracticeList.length) {
        practiceString = practiceString + element.Field_Name + '|'
      }
      else {
        practiceString = practiceString + element.Field_Name;
      }
    });
    this.service.excelData(this.ClientId, this.ConvertDateFormat(this.FromDate), this.ConvertDateFormat(this.ToDate), this.Action, practiceString)
      .subscribe((response: any) => {
        console.log('getDataForExcel() response : ', response);
        this.handleData(response.Data);
      }, (error) => {
        this.DisableSearch = false;
        console.log('getDataForExcel() error : ', error);
        this.ResponseHelper.GetFaliureResponse(error);
      })
  }

  handleData(Data) {
    // this.DisableSearch = true;
    console.log('clientApproval : ', Data);
    const finalArray = [];
    Data.forEach((client) => {
      const finalObj = {};
      client.forEach((element) => {
        finalObj[element.Header_Name] = element.Field_Value
      });
      finalArray.push(finalObj);
    });
    this.DisableSearch = false;
    this.excelService.exportAsExcelFile(finalArray, 'Client-Assurance-Reoprt');
    console.log('finalArray : ', finalArray);
  }
}

import { Component, OnInit } from '@angular/core';
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
  styleUrls: ['./client-approval.component.css']
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

  constructor(private router: Router, private notification: NotificationService, private commonservice: CommonService, private service: ClientApprovalService,private excelService:ExcelService) { }

  ngOnInit() {
    var tk = new Token(this.router);
    var userdata = tk.GetUserData();
    this.UserId = userdata.UserId;
    this.ClientId = userdata.Clients[0].Client_Id;
    this.Client_Name = userdata.Clients[0].Client_Name;
    this.ResponseHelper = new ResponseHelper(this.notification);
    this.MinDate = new Date('01/01/2000');
    //  this.GetClientList();
  }

  // GetClientList() {
  //   this.commonservice.GetClientList(this.UserId).subscribe(
  //     data => {

  //       this.ClientList = data.json().Data;
  //       if (this.ClientList.length == 1) {
  //         this.ClientId = this.ClientList[0].Id;
  //       }
  //     },
  //     err => {
  //       this.ResponseHelper.GetFaliureResponse(err)
  //     }
  //   )

  // }

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
    this.ShowAging = false;
    this.SelectedAging = null;
    this.DisableSearch = true;
    this.SelectedComment = '';
    this.service.GetSummaryAndComments(this.ClientId, this.ConvertDateFormat(this.FromDate), this.ConvertDateFormat(this.ToDate), this.Action)
      .pipe(finalize(() => {
        this.DisableSearch = false;
      })).subscribe(
        res => {
          this.Summary = res.json().Data.Client_Summary;
          this.Comments = res.json().Data.Dispostion_Details;
          this.ShowMain = true;
        },
        err => {
          this.ShowMain = false;
          this.ResponseHelper.GetFaliureResponse(err);
        }
      )
  }

  GetAging(s) {
    if (s.StandardComment != this.SelectedComment) {

      this.service.GetAging(this.ClientId, this.Action, this.ConvertDateFormat(this.FromDate), this.ConvertDateFormat(this.ToDate), s.StandardComment).subscribe(
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

  GetInventories(a) {
    if (a.Count != "0") {
      this.service.GetInventories(this.ClientId, this.Action, this.ConvertDateFormat(this.FromDate), this.ConvertDateFormat(this.ToDate), this.SelectedComment, a.AgeingName).subscribe(
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
    this.service.excelData(this.ClientId, this.ConvertDateFormat(this.FromDate), this.ConvertDateFormat(this.ToDate), this.Action).subscribe((response:any) => {
      console.log('getDataForExcel() response : ', response);
      this.handleData(response.Data)
    }, (error) => {
      this.DisableSearch = false;
      console.log('getDataForExcel() error : ', error);
      this.ResponseHelper.GetFaliureResponse(error);
    })
  }

  handleData(Data)
  {
    // this.DisableSearch = true;
    console.log('clientApproval : ', clientApproval);
    const finalArray=[];
    Data.forEach((client)=>{
      const finalObj = {};
      client.forEach((element)=>{
        finalObj[element.Header_Name]=element.Field_Value
      });
      finalArray.push(finalObj);
    });
    this.DisableSearch = false;
    this.excelService.exportAsExcelFile(finalArray, 'Client-Assurance-Reoprt');
    console.log('finalArray : ',finalArray);
  }

}

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/service/notification.service';
import { CommonService } from 'src/app/service/common-service';
import { Token } from 'src/app/manager/token';
import { ClientUserApprovalService } from 'src/app/service/client-user-approval.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-client-user',
  templateUrl: './client-user.component.html',
  styleUrls: ['./client-user.component.css'],
  encapsulation: ViewEncapsulation.None // Add this line

})
export class ClientUserComponent implements OnInit {
  Title = "Exception";
  ClientList = [];
  UserId = 0;
  ClientId = 0;
  Client_Name = '';
  ShowInventories = false;
  DisableSearch = false;
  ShowAging = false;
  ShowMain = false;
  MinDate: Date;
  FromDate: Date = new Date('01/01/2020');
  ToDate: Date = new Date();
  Action = "To Internal";
  ActionList = [
    { Key: "Pending", Value: "To Internal" },
    { Key: "To Gebbs", Value: "To Gebbs" },
    { Key: "Hold", Value: "Hold" },
    { Key: "Close", Value: "Close" }
    // ,{ Key: "To Internal", Value: "Client Internal" }
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
  constructor(private router: Router, private notification: NotificationService, private commonservice: CommonService, private service: ClientUserApprovalService) {

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
    // &practice=IG Din Bylor, MD|IMmen's Health Moore
    let practiceString = '';
    this.activePracticeList.forEach((element, index) => {
      if ((index + 1) < this.activePracticeList.length) {
        practiceString = practiceString + element.Field_Name + '|'
      }
      else {
        practiceString = practiceString + element.Field_Name;
      }
    });
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
  enableSearch() {

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

}

import { Component, OnInit, Input } from '@angular/core';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { AnalyticsService } from 'src/app/analytics.service';
import { AgentService } from 'src/app/service/agent.service';
import { NotificationService } from 'src/app/service/notification.service';
import { LogoutService } from 'src/app/service/logout.service';
import { Router } from '@angular/router';
import { Token } from 'src/app/manager/token';
import { ProjectandpriorityService } from 'src/app/service/projectandpriority.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input('title') title: string;
  @Input('activeReasonBucket') activeReasonBucket: string;
  showHeader = true;
  showExitMessage = false;
  ResponseHelper: ResponseHelper;
  UserData = null;
  Token;
  ClientId = 0;
  constructor(
    private notificationservice: NotificationService,
    private route: Router,
    private analyticsService: AnalyticsService,
    private logoutService: LogoutService,
    private agentservice: AgentService,
    private projectandpriorityService: ProjectandpriorityService
  ) {
    this.ResponseHelper = new ResponseHelper(this.notificationservice);
    this.Token = new Token(this.route)

  }

  ngOnInit() {
    this.UserData = this.Token.GetUserData();
    this.ClientId = this.UserData.Clients[0].Client_Id;
    console.log('this.showHeader : ');
    const localHeader = localStorage.getItem('showHeader');
    if (localHeader != undefined && localHeader == 'false') {
      this.showHeader = false;
      // this.setExitMessage(true);
    }
    else {
      this.showHeader = true;
    }
    // const bucket = sessionStorage.getItem('conclusionBucket');
    // if (bucket != null) {
    //   this.activeReasonBucket = bucket;
    // }
    // else {
    //   this.activeReasonBucket = null;
    // }
    // document.removeEventListener("keydown", function () { });
    // setTimeout(() => {
    // const self = this;
    // document.addEventListener('keydown', logKey);
    // function logKey(e) {
    //   console.log('keydown : ', e.keyCode, self.showHeader);
    //   if (e.keyCode == 27) {
    //     if (self.showHeader == false) {
    //       self.showHeader = true;
    //       localStorage.removeItem('showHeader');
    //       self.setExitMessage(false);
    //     }
    //   }
    //   // event.preventDefault()
    // }
    // // }, 1000);


  }
  hideHeader() {
    console.log('hideHeader() : ', this.showHeader);
    if (this.showHeader == true || this.showHeader == null) { this.showHeader = false; }
    this.setExitMessage(true);
    localStorage.setItem('showHeader', 'false');
    setTimeout(() => {
      // this.setExitMessage(false);
    }, 2000);
  }

  setExitMessage(status) {
    console.log('setExitMessage : ', status);
    this.showExitMessage = status;
  }

  Logout() {
    console.log('Logout() :')
    this.analyticsService.logOutEvent('Login/Logout').subscribe((response) => {
      console.log('logEvent : ', response);
    }, (error) => {
      console.log('logEvent : ', error);
    });
    // this.LogoutFromSystem();
    if (this.route.url == '/agent') {
      var logId = 0;
      if (sessionStorage.length > 1) {
        var acc = JSON.parse(sessionStorage.getItem('Accounts'))
        if (acc && acc.length != 0) {
          acc.forEach(e => {
            if (e.Processed == 'Working') {
              logId = e.Inventory_Log_Id ? e.Inventory_Log_Id : 0;
            }
          });
        }
        if (logId != null && logId != 0) {
          this.EndCurrentAccount(logId);
        }
        else {
          this.LogoutFromSystem();
        }
      }
      else {
        this.LogoutFromSystem();
      }

    }
    else if (this.route.url == '/supervisor-agent') {
      var LogDetails;
      if (sessionStorage.length > 1) {
        LogDetails = JSON.parse(sessionStorage.getItem('WorkingLog'));
        this.ClientId = LogDetails.Client_Id;
        var Inventory_Log_Id = LogDetails.Inventory_Log_Id ? LogDetails.Inventory_Log_Id : 0;
        this.EndCurrentAccount(Inventory_Log_Id);
      }
      else {
        this.LogoutFromSystem();
      }
    }
    else {
      this.LogoutFromSystem();
    }

  }

  EndCurrentAccount(logId) {
    var formobj = {
      Client_Id: this.ClientId,
      Inventory_Log_Id: logId
    }
    console.log('EndCurrentAccount : ', formobj)
    this.agentservice.InsertEndTimeOfInventory(formobj).subscribe(
      res => {
        sessionStorage.removeItem("Accounts");
        this.LogoutFromSystem();
      },
      err => {
        this.ResponseHelper.GetFaliureResponse(err);
      }
    );
  }

  LogoutFromSystem() {
    // var objs = new Object();
    // const User_Id = this.UserData.UserId;
    // objs["Id"] = User_Id;
    this.logoutService.Logout({ Id: this.UserData.UserId }).subscribe(res => {
      // this.Toggle.emit(false);
      setTimeout(() => {
        this.route.navigate(['/login']);
      }, 1000);
      this.ResponseHelper.GetSuccessResponse(res);
    },
      err => {
        this.ResponseHelper.GetFaliureResponse(err);
      }
    );
  }
  openProjectAndPriorityModal() {
    this.projectandpriorityService.showProjectModal = true;
  }
}

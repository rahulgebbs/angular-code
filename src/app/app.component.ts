import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Token } from 'src/app/manager/token';
import { AgentService } from 'src/app/service/agent.service';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
import { AnalyticsService } from './analytics.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event) {
    localStorage.tabCount = localStorage.tabCount - 1;
    this.analyticsService.logEvent('Browser Closed').subscribe((response) => {
      console.log('logEvent : ', response);
    }, (error) => {
      console.log('logEvent : ', error);
    });
    // return false
    /// remove above comment to show popup to user on page refresh or close
  }

  ngOnInit(): void {

    this.Getcount();

    // setTimeout(() => {
    //   $('#utility-section .utility-menu').hide();
    //   $('#utility-section .utility-menu:lt(3)').show();
    // }, 100)
  }

  ResponseHelper: ResponseHelper;
  breakStatus;
  title = 'GeBBS : iAR';
  MenuName: string;
  DisplayMenu;
  ShowElement: boolean = false;
  FirstLogin;
  Token: Token;
  resumeBreak;
  constructor(private router: Router,
    private ts: Title,
    private agentService: AgentService,
    private analyticsService: AnalyticsService,
    private notificationservice: NotificationService,
  ) {
    this.ResponseHelper = new ResponseHelper(this.notificationservice);
    this.breakAction();
  }
  breakAction() {
    this.breakStatus = sessionStorage.getItem('BreakStatus');
    this.resumeBreak = sessionStorage.getItem('resumeBreak');
    if (this.breakStatus == "true" && this.resumeBreak != null) {
      let data = JSON.parse(this.resumeBreak)
      this.agentService.endBreak(data).subscribe(res => {
        this.ResponseHelper.GetSuccessResponse(res);
        sessionStorage.setItem('BreakStatus', "false");
        sessionStorage.setItem('resumeBreak', null);
      }, err => {
        this.ResponseHelper.GetFaliureResponse(err);
        sessionStorage.setItem('BreakStatus', "true");
      });
    }
  }


  Getcount() {
    localStorage.tabCount = +localStorage.tabCount + 1;

    window.onunload = function () {
      localStorage.tabCount = +localStorage.tabCount - 1;
    };

    if (localStorage.tabCount > 0) {
      this.router.navigate(['/multiple-tab']);
    }
    else {
      localStorage.tabCount = 0;
    }
  }

  ChangeRouteName(event) {
    this.ShowElement = true;
    if (event.router != undefined) {

      this.MenuName = event.router.url;

      switch (event.router.url) {
        case '/login':
          this.ShowElement = false;
          break;
        case '/two-factor-auth':
          this.ShowElement = false;
          break;
        case '/forgot-password':
          this.ShowElement = false;
          break;
        case '/change-password':
          try {
            this.Token = new Token(this.router);
            this.FirstLogin = this.Token.GetUserData().FirstLogin;
            if (this.FirstLogin == false) {
              this.ShowElement = true;
            } else {
              this.ShowElement = false;
            }
            break;
          } catch (Exception) {
            let data = [{ Message: "Please Login First.", Type: "ERROR" }]
            this.notificationservice.ChangeNotification(data)
            this.router.navigateByUrl[('/login')]
          }
      }
      let menuname: string = event.router.url;
      menuname = menuname.split("-").join(" ").substring(1);
      menuname = menuname.replace(/(\w)(\w*)/g,
        function (g0, g1, g2) { return g1.toUpperCase() + g2.toLowerCase(); });
      this.ts.setTitle(menuname + " | " + this.title);
    }
    else {
      this.ShowElement = false;
    }

    // this.routename = event.value;
  }

  ToggleMenu(event) {
    this.DisplayMenu = event;
  }

  ToggleMenuFromFooter(event) {
    this.DisplayMenu = event;
  }

}



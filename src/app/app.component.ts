import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Token } from 'src/app/manager/token';
import { AgentService } from 'src/app/service/agent.service';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
import { AnalyticsService } from './analytics.service';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  @HostListener('window:beforeunload', ['$event'])
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;
  ResponseHelper: ResponseHelper;
  breakStatus;
  title = 'GeBBS : iAR';
  MenuName: string;
  DisplayMenu;
  ShowElement: boolean = false;
  FirstLogin;
  Token: Token;
  resumeBreak;
  showTimeoutModal = false;
  constructor(private router: Router,
    private idle: Idle, private keepalive: Keepalive,
    private ts: Title,
    private agentService: AgentService,
    private analyticsService: AnalyticsService,
    private notificationservice: NotificationService,
  ) {
    this.ResponseHelper = new ResponseHelper(this.notificationservice);
    this.breakAction();
  }
  beforeUnloadHander(event) {
    console.log('beforeUnloadHander event : ', event);
    localStorage.tabCount = localStorage.tabCount - 1;
    this.analyticsService.logEvent('Browser Closed').subscribe((response) => {
      console.log('logEvent : ', response);
    }, (error) => {
      console.log('logEvent : ', error);
    });
    // alert('before unload');
    // return false
    /// remove above comment to show popup to user on page refresh or close
  }


  ngOnInit(): void {
    // this.initiateTimer();
    this.Getcount();
  }

  initiateTimer() {
    // sets an idle timeout of 5 seconds, for testing purposes.
    this.idle.setIdle(5);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    this.idle.setTimeout(5);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onIdleEnd.subscribe(() => {
      this.idleState = 'No longer idle.'
      console.log(this.idleState);
      // this.reset();
    });

    this.idle.onTimeout.subscribe(() => {
      // this.childModal.hide();
      this.showTimeoutModal = false;
      this.idleState = 'Timed out!';
      this.timedOut = true;
      console.log('onTimeout : ', this.idleState);
      // sessionStorage.clear();
      this.router.navigate(['/']);
      console.log('onPing : ', this.lastPing);
    });

    this.idle.onIdleStart.subscribe(() => {
      this.idleState = 'You\'ve gone idle!'
      console.log('onIdleStart : ', this.idleState);
      this.showTimeoutModal = true;
      // this.childModal.show();
    });

    this.idle.onTimeoutWarning.subscribe((countdown) => {
      this.idleState = 'You will time out in ' + countdown + ' seconds!'
      console.log('onTimeoutWarning : ', this.idleState);
    });

    // sets the ping interval to 15 seconds
    this.keepalive.interval(15);

    this.keepalive.onPing.subscribe(() => {
      console.log('onPing : ', this.lastPing);
      this.lastPing = new Date();
      return this.lastPing;
    });

    this.chekIfUserLoggedIn();
    // this.appService.getUserLoggedIn().subscribe(userLoggedIn => {
    //   if (userLoggedIn) {
    //     idle.watch()
    //     this.timedOut = false;
    //   } else {
    //     idle.stop();
    //   }
    // })
  }
  reset() {
    this.idle.watch();
    //xthis.idleState = 'Started.';
    this.timedOut = false;
  }
  chekIfUserLoggedIn() {
    this.Token = new Token(this.router);
    console.log('chekIfUserLoggedIn : ', this.Token.GetUserData());
    if (this.Token && this.Token.GetUserData()) {
      this.idle.watch();
    }
    else {
      this.idle.stop();
    }
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
  }

  ToggleMenu(event) {
    this.DisplayMenu = event;
  }

  ToggleMenuFromFooter(event) {
    this.DisplayMenu = event;
  }

  stay() {
    this.showTimeoutModal = false;
    this.reset();
  }
}



import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from "@angular/router"

import { LoginService } from '../../service/login.service';
import { Token } from '../../manager/token';
import { NotificationService } from 'src/app/service/notification.service';
import { Notification } from 'src/app/manager/notification';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { RedirectHelper } from 'src/app/manager/redirect'
import { AnalyticsService } from 'src/app/analytics.service';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {
  MyForm: FormGroup;
  DisplayError: Boolean = false;
  DisableSubmit: Boolean = false;
  Token: Token;
  CurrentYear;
  ResponseHelper
  captchaArray = [];
  gradientColor = null;
  captchaModel = '';
  constructor(
    private loginservice: LoginService,
    private notificationservice: NotificationService,
    private RedirectHelper: RedirectHelper,
    private idle: Idle, private keepalive: Keepalive,
    private analyticsService: AnalyticsService,
    private router: Router) {

    this.CurrentYear = (new Date()).getFullYear();
  }

  ngOnInit() {
    // this.RedirectHelper = new RedirectHelper(this.router)
    this.createForm();
    this.Token = new Token(this.router);
    this.Token.ClearUserData();
    this.ResponseHelper = new ResponseHelper(this.notificationservice);
    this.makeid();
  }

  logEvent() {
    this.analyticsService.logEvent('Login').subscribe((response) => {
      console.log('logEvent : ', response);
    }, (error) => {
      console.log('logEvent : ', error);
    });
  }
  FormSubmit() {
    this.DisableSubmit = true;
    if (this.MyForm.valid) {
      this.DisplayError = false;
      this.loginservice.Login(this.MyForm.value).subscribe(
        (data) => {
          this.ResponseHelper.GetSuccessResponse(data);
          if (data.json().Data.Token != null) {
            setTimeout(() => {
              const response = data.json().Data;
              console.log('response : ', response);
              // response['enableTFAuth'] = { enable: true, status: "incomplete" };
              if (response.enableTFAuth && response.enableTFAuth.enable == true) {
                localStorage.setItem('token', data.json().Data.Token);
                sessionStorage.setItem("enableTFAuth", JSON.stringify(response.enableTFAuth));
                this.router.navigate(['/two-factor-auth']);
              }
              else {
                // this.router.navigate(['/Login']);
                this.Token.SetLoginToken(data.json().Data.Token);
                if (data.json().Data.First_Login == true) {
                  this.router.navigate(['/change-password']);
                }
                else {
                  this.RedirectHelper.redirectByRole()
                }
              }
              this.logEvent();
              this.initiateTime();
            }, 2000);

          }
          else {

            const response = data.json()
            console.log('Login err : ', response);
            const Message = response && response.Message && response.Message.length > 0 ? response.Message[0] : null;
            sessionStorage.setItem('UserID', response.Data.Id);
            if (Message && Message.Message == 'Your password has expired, Please reset') {
              this.router.navigate(['/reset-password']);
            }
            // Your password has expired, Please reset
            this.DisableSubmit = false;
          }
        }, (err) => {
          this.ResponseHelper.GetFaliureResponse(err)
          this.DisableSubmit = false;
          const response = err.json()
          console.log('Login err : ', err.json());
          const Message = response && response.Message && response.Message.length > 0 ? response.Message[0] : null;
          if (Message && Message.Message == 'Invalid User credentials.') {

          }
          this.logEvent();
        }
      );
    }
    else {
      this.DisplayError = true;
      this.DisableSubmit = false;
    }
  }

  initiateTime() {
    // sets an idle timeout of 5 seconds, for testing purposes.
    this.loginservice.getTimeout().subscribe((response) => {
      console.log('idleTime response: ', response);
      let idleTime = Number(response.Data.Time_In_Minutes) * 60;
      idleTime = idleTime - 10;

      console.log('idleTime : ', idleTime);
      // let data = [{ Message: "Session Timeout Started", Type: "SUCCESS" }]
      // this.notificationservice.ChangeNotification(data);
      const timeOutTime = 10;
      sessionStorage.setItem('sessionTime', idleTime.toString());
      this.idle.setIdle(idleTime);
      // sets a timeout period of 10 seconds. after 10 seconds of inactivity, the user will be considered timed out.
      this.idle.setTimeout(timeOutTime);
      this.idle.watch();
    }, (error) => {
      console.log('idleTime error : ', error);
    })
  }
  createForm() {
    const self = this;
    function customValidator(control) {
      // console.log('customValidator : ', control);
      if (control.value != null && control.value.length > 0) {
        const validCaptcha = self.checkIfValid(control.value);
        console.log('this.checkIfValid : ', validCaptcha);
        if (validCaptcha == false) {
          return { 'invalidCaptcha': true }
        }
      }
      else {
        return { 'captchaRequired': true }
      }
      control.setErrors(null);
    };

    this.MyForm = new FormGroup({
      username: new FormControl('', [Validators.required
      ]),
      password: new FormControl('', [Validators.required
      ]),
      captchaModel: new FormControl('', [customValidator])
    });
    // console.log('myForm : ',this.MyForm);
  }

  makeid() {
    this.randomGradientColor();
    this.captchaArray = [];
    var result = '';
    const { value } = this.MyForm;
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 6; i++) {
      const randomChar = characters.charAt(Math.floor(Math.random() * charactersLength));
      result += randomChar;
      this.captchaArray.push(randomChar)
    }
    if (value && value.captchaModel != null && value.captchaModel.length > 0) {
      console.log('this.MyForm : ', this.MyForm);
      const result = this.checkIfValid(value.captchaModel);
      if (result == false) {
        this.MyForm.controls.captchaModel.setErrors({ invalidCaptcha: true })
      }
    }
  }

  randomGradientColor() {


    var hexValues = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e"];

    function populate(a) {
      for (var i = 0; i < 6; i++) {
        var x = Math.round(Math.random() * 14);
        var y = hexValues[x];
        a += y;
      }
      return a;
    }

    var newColor1 = populate('#');
    var newColor2 = populate('#');
    var angle = Math.round(Math.random() * 360);

    this.gradientColor = "linear-gradient(" + angle + "deg, " + newColor1 + ", " + newColor2 + ")";
    // console.log('gradient : ', this.gradientColor);
    // document.getElementById("container").style.background = gradient;
    // document.getElementById("output").innerHTML = gradient;
  }
  checkIfValid(value) {
    // console.log('checkIfValid() : ', value.split(''), this.captchaArray);
    const answerStr: any = value.split('');
    if (answerStr.join() == this.captchaArray) {
      // alert('Correct')
      return true;
    }
    else {
      return false;
      // alert('Incorrect')
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router"

import { ForgotPaswordService } from '../../service/forgot-pasword.service';
import { NotificationService } from 'src/app/service/notification.service';
import { customValidation } from 'src/app/manager/customValidators';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { finalize } from 'rxjs/operators';

import * as  moment from 'moment';
@Component({
  selector: 'app-forgot-password-new',
  templateUrl: './forgot-password-new.component.html',
  styleUrls: ['./forgot-password-new.component.scss']
})
export class ForgotPasswordNewComponent implements OnInit {

  MyForm: FormGroup;
  ResetForm: FormGroup;
  DisplayError: Boolean;
  DisableSubmit: Boolean = false;
  SwitchToReset: Boolean = true;
  ResponseHelper;
  captchaArray = [];
  gradientColor = null;
  captchaModel = '';
  timeInterval;
  securityCodeTime;
  constructor(private forgotpasswordservice: ForgotPaswordService, private notificationservice: NotificationService, private router: Router, private route: ActivatedRoute, private notification: NotificationService) { }


  ngOnInit() {
    // this.CreateForm();
    this.CreateResetForm();
    this.route.params.subscribe((params) => {
      console.log('params : ', params);
      if (params && params.securityCode) {
        // this.valdateCode(params.securityCode);
      }
    })
    // this.makeid();
    this.ResponseHelper = new ResponseHelper(this.notificationservice);
  }

  valdateCode(code) {
    this.forgotpasswordservice.validateCode(code).subscribe((response: any) => {
      console.log('response: ', response);
      this.ResetForm.patchValue({ Username: response.Data.User_Id })
      this.securityCodeTime = moment(response.Data.Mail_Sent_Time).format();
    }, (error) => {

    });
    this.validteTime();
  }
  validteTime() {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
    this.timeInterval = setInterval(() => {
      var ogDate = moment(this.securityCodeTime);
      const diff = moment().diff(ogDate, 'seconds');
      console.log('diff, this.securityCodeTime, moment().format() : ', diff, this.securityCodeTime, moment().format());
      if (diff && diff >= diff) {
        clearInterval(this.timeInterval);
        this.notification.ChangeNotification([{ Message: "Link Expired", Type: "ERROR" }])
        this.router.navigate(['/login'])
      }
    }, 1000);
  }
  // CreateForm() {
  //   // const self = this;
  //   // function customValidator(control) {
  //   //   console.log('customValidator : ', control);
  //   //   if (control.value != null && control.value.length > 0) {
  //   //     const validCaptcha = self.checkIfValid(control.value);
  //   //     console.log('this.checkIfValid : ', validCaptcha);
  //   //     if (validCaptcha == false) {
  //   //       // control.setErrors({invalidCaptcha : true})
  //   //       return { 'invalidCaptcha': true }
  //   //       // return null
  //   //     }
  //   //   }
  //   //   else {
  //   //     // control.setErrors({captChaRequired : true})
  //   //     // return null
  //   //     return { 'captchaRequired': true }
  //   //   }
  //   //   control.setErrors(null);
  //   //   // return null;
  //   // };
  //   // this.MyForm = new FormGroup({
  //   //   username: new FormControl('', [Validators.required
  //   //   ]),
  //   //   captchaModel: new FormControl('', [customValidator])
  //   // });
  // }

  // ForgotSubmit() {
  //   this.DisableSubmit = true;
  //   console.log('ForgotSubmit() : ', this.MyForm);
  //   if (this.MyForm.valid) {
  //     this.DisplayError = false;
  //     this.forgotpasswordservice.ForgotPassword(this.MyForm.value).pipe(finalize(() => {
  //       this.DisableSubmit = false;
  //     })).subscribe(
  //       data => {
  //         this.ResponseHelper.GetSuccessResponse(data)
  //         this.CreateResetForm();
  //         // setTimeout(() => {
  //         this.SwitchToReset = true;
  //         // }, 2000);
  //       }, err => {
  //         this.ResponseHelper.GetFaliureResponse(err)
  //       })
  //   }
  //   else {
  //     this.DisplayError = true;
  //     this.DisableSubmit = false;
  //   }
  // }

  CreateResetForm() {
    const self = this;
    function customValidator(control) {
      console.log('customValidator : ', control);
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
    this.ResetForm = new FormGroup({
      // Username: new FormControl(this.MyForm.controls['username'].value, Validators.required),
      Username: new FormControl('', Validators.required),
      Temporary_Password: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(5)
      ]),
      New_Password: new FormControl('', [Validators.required
        , Validators.minLength(8), Validators.maxLength(20),
      Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-/(/)/_/+/]).{8,}$')
      ]),
      confirmnewpass: new FormControl('', [Validators.required,
      ]),
      captchaModel: new FormControl('', [customValidator])
    }, { validators: customValidation.MatchPassword });
    this.captchaForResetPassword();
  }

  ResetPassword() {
    this.DisableSubmit = true;
    console.log('ResetPassword : ', this.ResetForm);
    if (this.ResetForm.valid) {
      this.DisplayError = false;
      this.forgotpasswordservice.ResetPassword(this.ResetForm.value).subscribe(
        data => {
          this.ResponseHelper.GetSuccessResponse(data)
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);

        }, err => {
          this.ResponseHelper.GetFaliureResponse(err)
          this.DisableSubmit = false;

        })
    }
    else {
      this.DisplayError = true;
      this.DisableSubmit = false;
    }
  }

  // makeid() {
  //   this.randomGradientColor();
  //   this.captchaArray = [];
  //   var result = '';
  //   const { value } = this.MyForm;
  //   var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  //   var charactersLength = characters.length;
  //   for (var i = 0; i < 6; i++) {
  //     const randomChar = characters.charAt(Math.floor(Math.random() * charactersLength));
  //     result += randomChar;
  //     this.captchaArray.push(randomChar)
  //   }
  //   if (value && value.captchaModel != null && value.captchaModel.length > 0) {
  //     console.log('this.MyForm : ', this.MyForm);
  //     const result = this.checkIfValid(value.captchaModel);
  //     if (result == false) {
  //       this.MyForm.controls.captchaModel.setErrors({ invalidCaptcha: true })
  //     }
  //   }
  // }

  captchaForResetPassword() {
    this.randomGradientColor();
    this.captchaArray = [];
    var result = '';
    const { value } = this.ResetForm;
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 6; i++) {
      const randomChar = characters.charAt(Math.floor(Math.random() * charactersLength));
      result += randomChar;
      this.captchaArray.push(randomChar)
    }
    if (value && value.captchaModel != null && value.captchaModel.length > 0) {
      console.log('this.ResetForm : ', this.ResetForm);
      const result = this.checkIfValid(value.captchaModel);
      if (result == false) {
        this.ResetForm.controls.captchaModel.setErrors({ invalidCaptcha: true })
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
    console.log('gradient : ', this.gradientColor);
    // document.getElementById("container").style.background = gradient;
    // document.getElementById("output").innerHTML = gradient;
  }

  checkIfValid(value) {
    console.log('checkIfValid() : ', value.split(''), this.captchaArray);
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

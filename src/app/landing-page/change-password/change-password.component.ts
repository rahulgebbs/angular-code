import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from "@angular/router"

import { ChangePasswordService } from '../../service/change-password.service';
import { Token } from '../../manager/token';
import { customValidation } from '../../manager/customValidators';
import { NotificationService } from 'src/app/service/notification.service';
import { ResponseHelper } from 'src/app/manager/response.helper';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  providers: [ChangePasswordService]
})
export class ChangePasswordComponent implements OnInit {
  title: string = "Reset Password";
  ChangeForm: FormGroup;
  DisplayError: Boolean;
  DisableSubmit: Boolean = false;
  Token: Token;
  UserId: number;
  ResponseHelper;
  captchaArray = [];
  gradientColor = null;
  captchaModel = '';
  constructor(private ChangePasswordService: ChangePasswordService, private notificationservice: NotificationService, private router: Router) {
    this.Token = new Token(this.router);

    var data = this.Token.GetUserData();
    this.UserId = data.UserId;
  }


  ngOnInit() {
    this.createForm();
    this.ResponseHelper = new ResponseHelper(this.notificationservice);

  }

  createForm() {

    const self = this;
    function customValidator(control) {
      console.log('customValidator : ', control);
      if (control.value != null && control.value.length > 0) {
        const validCaptcha = self.checkIfValid(control.value);
        console.log('this.checkIfValid : ', validCaptcha);
        if (validCaptcha == false) {
          // control.setErrors({invalidCaptcha : true})
          return { 'invalidCaptcha': true }
          // return null
        }
      }
      else {
        // control.setErrors({captChaRequired : true})
        // return null
        return { 'captchaRequired': true }
      }
      control.setErrors(null);
      // return null;
    };
    this.ChangeForm = new FormGroup({
      User_Id: new FormControl(this.UserId, [Validators.required]),
      Old_Password: new FormControl('', [Validators.required
        , Validators.minLength(8), Validators.maxLength(20)
      ]),
      New_Password: new FormControl('', [Validators.required
        , Validators.minLength(8), Validators.maxLength(20),
      //Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?#&])[A-Za-z\d$@$!%*?#&].{7,}')
      Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-/(/)/_/+/]).{8,}$')
      ]),
      confirmnewpass: new FormControl('', [Validators.required,
        // ,Validators.minLength(8), Validators.maxLength(20)
      ]),
      captchaModel: new FormControl('', [customValidator])
    }, { validators: [customValidation.MatchPassword, customValidation.NewPasswordMatchWithOld] });
    this.makeid();
  }

  ChangePassword() {
    this.DisableSubmit = true;
    if (this.ChangeForm.valid) {
      this.DisplayError = false;
      this.ChangePasswordService.ChangePassword(this.ChangeForm.value)
        .subscribe(
          (data) => {
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
  makeid() {

    this.randomGradientColor();
    this.captchaArray = [];
    var result = '';
    const { value } = this.ChangeForm;
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 6; i++) {
      const randomChar = characters.charAt(Math.floor(Math.random() * charactersLength));
      result += randomChar;
      this.captchaArray.push(randomChar)
    }

    if (value && value.captchaModel != null && value.captchaModel.length > 0) {
      console.log('this.ChangeForm : ', this.ChangeForm);
      const result = this.checkIfValid(value.captchaModel);
      if (result == false) {
        this.ChangeForm.controls.captchaModel.setErrors({ invalidCaptcha: true })
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
    }
  }

}

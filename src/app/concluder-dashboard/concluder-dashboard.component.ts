import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/service/notification.service';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { Token } from '../manager/token';

@Component({
  selector: 'app-concluder-dashboard',
  templateUrl: './concluder-dashboard.component.html',
  styleUrls: ['./concluder-dashboard.component.css']
})
export class ConcluderDashboardComponent implements OnInit {
  dashboard: FormGroup;
  ClientList: any[] = [];
  userdata: any;
  ResponseHelper: ResponseHelper;
  keyList = ["Id", "Buckets",
    "To_Be_Concluded",
    "Rejections",
    "Paid_EOB_Availble",
    "Paid_NO_EOB",
    "Denials_Provider_Issue",
    "Denials_Payer_Issue",
    "Denials_Patient_Issue",
    "Denials_Coding_Issue",
    "No_Response_Website",
    "No_Response_IVR",
    "No_Response_Fax",
    "No_Response_Calling"];
  dashboardData = [];
  title = "Concluder Dashboard";
  clientName = null;
  constructor(private router: Router, private notification: NotificationService, public fb: FormBuilder) {
    this.ResponseHelper = new ResponseHelper(this.notification);


    this.dashboard = this.fb.group({
      "ClientId": [null, Validators.required]
    })
  }
  ngOnInit() {
    let token = new Token(this.router);
    this.userdata = token.GetUserData();
    // this.UserId = this.userdata.UserId;
    this.ClientList = this.userdata.Clients;
    console.log('this.userdata : ', this.userdata, this.ClientList, this.dashboard);
    this.getResponseList();
    // this.selectedValue(this.ClientList)
  }

  selectedClient() {
    console.log('selectedClient()', this.dashboard.value)
  }

  getResponseList() {
    this.dashboardData = [
      {
        "Id": 1,
        "Buckets": "Total $$",
        "To_Be_Concluded": 521376,
        "Rejections": 8000,
        "Paid_EOB_Availble": 9000,
        "Paid_NO_EOB": 3000,
        "Denials_Provider_Issue": 1000,
        "Denials_Payer_Issue": 5000,
        "Denials_Patient_Issue": 10001,
        "Denials_Coding_Issue": 5000,
        "No_Response_Website": 5025,
        "No_Response_IVR": 5003,
        "No_Response_Fax": 10009,
        "No_Response_Calling": 5025
      },
      {
        "Id": 2,
        "Buckets": "Total ##",
        "To_Be_Concluded": 100,
        "Rejections": 1,
        "Paid_EOB_Availble": 1,
        "Paid_NO_EOB": 1,
        "Denials_Provider_Issue": 1,
        "Denials_Payer_Issue": 1,
        "Denials_Patient_Issue": 2,
        "Denials_Coding_Issue": 1,
        "No_Response_Website": 1,
        "No_Response_IVR": 1,
        "No_Response_Fax": 2,
        "No_Response_Calling": 1
      },
      {
        "Id": 3,
        "Buckets": "Pending $$",
        "To_Be_Concluded": 455313,
        "Rejections": 0,
        "Paid_EOB_Availble": 0,
        "Paid_NO_EOB": 0,
        "Denials_Provider_Issue": 0,
        "Denials_Payer_Issue": 0,
        "Denials_Patient_Issue": 0,
        "Denials_Coding_Issue": 0,
        "No_Response_Website": 0,
        "No_Response_IVR": 0,
        "No_Response_Fax": 0,
        "No_Response_Calling": 0
      },
      {
        "Id": 4,
        "Buckets": "Pending ##",
        "To_Be_Concluded": 87,
        "Rejections": 0,
        "Paid_EOB_Availble": 0,
        "Paid_NO_EOB": 0,
        "Denials_Provider_Issue": 0,
        "Denials_Payer_Issue": 0,
        "Denials_Patient_Issue": 0,
        "Denials_Coding_Issue": 0,
        "No_Response_Website": 0,
        "No_Response_IVR": 0,
        "No_Response_Fax": 0,
        "No_Response_Calling": 0
      },
      {
        "Id": 5,
        "Buckets": "%%_$$",
        "To_Be_Concluded": 0.87,
        "Rejections": 0,
        "Paid_EOB_Availble": 0,
        "Paid_NO_EOB": 0,
        "Denials_Provider_Issue": 0,
        "Denials_Payer_Issue": 0,
        "Denials_Patient_Issue": 0,
        "Denials_Coding_Issue": 0,
        "No_Response_Website": 0,
        "No_Response_IVR": 0,
        "No_Response_Fax": 0,
        "No_Response_Calling": 0
      },
      {
        "Id": 6,
        "Buckets": "%%%_##",
        "To_Be_Concluded": 0.87,
        "Rejections": 0,
        "Paid_EOB_Availble": 0,
        "Paid_NO_EOB": 0,
        "Denials_Provider_Issue": 0,
        "Denials_Payer_Issue": 0,
        "Denials_Patient_Issue": 0,
        "Denials_Coding_Issue": 0,
        "No_Response_Website": 0,
        "No_Response_IVR": 0,
        "No_Response_Fax": 0,
        "No_Response_Calling": 0
      },
      {
        "Id": 7,
        "Buckets": "Allocated ##",
        "To_Be_Concluded": 87,
        "Rejections": 0,
        "Paid_EOB_Availble": 0,
        "Paid_NO_EOB": 0,
        "Denials_Provider_Issue": 0,
        "Denials_Payer_Issue": 0,
        "Denials_Patient_Issue": 0,
        "Denials_Coding_Issue": 0,
        "No_Response_Website": 0,
        "No_Response_IVR": 0,
        "No_Response_Fax": 0,
        "No_Response_Calling": 0
      },
      {
        "Id": 8,
        "Buckets": "Done $$",
        "To_Be_Concluded": 66063,
        "Rejections": 8000,
        "Paid_EOB_Availble": 9000,
        "Paid_NO_EOB": 3000,
        "Denials_Provider_Issue": 1000,
        "Denials_Payer_Issue": 5000,
        "Denials_Patient_Issue": 10001,
        "Denials_Coding_Issue": 5000,
        "No_Response_Website": 5025,
        "No_Response_IVR": 5003,
        "No_Response_Fax": 10009,
        "No_Response_Calling": 5025
      },
      {
        "Id": 9,
        "Buckets": "Done ##",
        "To_Be_Concluded": 13,
        "Rejections": 1,
        "Paid_EOB_Availble": 1,
        "Paid_NO_EOB": 1,
        "Denials_Provider_Issue": 1,
        "Denials_Payer_Issue": 1,
        "Denials_Patient_Issue": 2,
        "Denials_Coding_Issue": 1,
        "No_Response_Website": 1,
        "No_Response_IVR": 1,
        "No_Response_Fax": 2,
        "No_Response_Calling": 1
      }
    ]
  }

  getClientName() {
    const { value } = this.dashboard;
    this.ClientList.find((client) => {
      if (client.ClientId == value.Client_Id) {
        // return client.Client_Name;
        this.clientName = client.Client_Name;
        return true
      }
    });
    console.log('this.clientName : ', this.clientName, this.ClientList);
  }
}


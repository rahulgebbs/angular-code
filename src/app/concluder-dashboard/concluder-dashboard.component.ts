import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/service/notification.service';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { Token } from '../manager/token';
import { PcnService } from '../service/pcn.service';

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
  constructor(private router: Router, private notification: NotificationService, public fb: FormBuilder, private pcnService: PcnService) {
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
    // this.getResponseList();
    // this.selectedValue(this.ClientList)
  }

  selectedClient() {
    console.log('selectedClient()', this.dashboard.value);
  }

  search() {
    const { value } = this.dashboard;
    if (value && value.ClientId) {

      this.getAllocatedCount(value.ClientId);
      this.getConcluderDashboard(value.ClientId);
    }
  }

  getConcluderDashboard(ClientId) {
    this.pcnService.getConcluderDashboard(ClientId).subscribe((response) => {
      console.log('getConcluderDashboard response : ', response);
      this.dashboardData = response.Data;
    }, (error) => {
      console.log('getConcluderDashboard error : ', error);
      this.dashboardData = [];
    })
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

  getAllocatedCount(ClientId) {
    this.pcnService.getAllocatedCount(ClientId).subscribe((response) => {
      console.log('getAllocatedCount() response : ', response);
    }, (error) => {
      console.log('error : ', error);
    })

  }
}


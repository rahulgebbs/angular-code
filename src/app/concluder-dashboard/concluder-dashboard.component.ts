import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/service/notification.service';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// import * as moment from 'moment';
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
  keyList = ["Id", "Bucket_Label",
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
  allocatedCountList = [];
  submitStatus = null;
  activeAllocatedCount = [];
  showAllocatedCountModal = false;
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
      this.submitStatus = true;
      this.getConcluderDashboard(value.ClientId);
      this.getAllocatedCount(value.ClientId);
    }
  }

  getConcluderDashboard(ClientId) {
    this.dashboardData = [];
    this.submitStatus = true;
    this.pcnService.getConcluderDashboard(ClientId).subscribe((response) => {
      console.log('getConcluderDashboard response : ', response);
      this.dashboardData = response.Data;

      this.setBucketListName();
      this.submitStatus = false;
      this.ResponseHelper.GetSuccessResponse(response);
    }, (error) => {
      console.log('getConcluderDashboard error : ', error);
      this.dashboardData = [];
      this.submitStatus = false;
      this.ResponseHelper.GetFaliureResponse(error);
    })
  }
  setBucketListName() {
    this.dashboardData.forEach((data) => {
      if (data.Buckets == '%%_$$') {
        data.Bucket_Label = 'Pending % ($ Value)';
        this.setPercentageValue(data);
      }
      else if (data.Buckets == '%%%_##') {
        data.Bucket_Label = 'Pending % Count';
        this.setPercentageValue(data);
      }
      else {
        data.Bucket_Label = data.Buckets;
        if (data.Bucket_Label != 'Allocated ##') {
          this.keyList.forEach((key) => {
            if (key != "Id" && key != "Bucket_Label" && key != "Bucket_Label") {
              data[key] = data[key] != null && data[key] > 0 ? data[key] : "-";
            }
          })
        }
      }

    })
  }

  setPercentageValue(data) {
    this.keyList.forEach((key) => {
      if (key != 'Id' && key != 'Bucket_Label') {
        console.log('Before : ', data[key]);
        // if (data[key]) {
        data[key] = data[key] > 0 ? (data[key] * 100) + '%' : '0%'
        // }
        console.log('After : ', data[key]);
      }
      else {
        console.log('ELSE setPercentageValue : ', key);
      }
    })


  }
  getClientName() {
    const { value } = this.dashboard;
    this.clientName = null;
    this.ClientList.forEach((client) => {
      console.log('check in loop : ', client, value);
      if (client.Client_Id.toString() == value.ClientId) {
        // return client.Client_Name;
        this.clientName = client.Client_Name;
        // this.dashboard.patchValue({ Client_Id: value.Client_Id });
        // return true;
      }
    });
    // this.dashboardData = JSON.parse(JSON.stringify(this.dashboardData));
    console.log('this.clientName : ', this.clientName, this.ClientList);
  }

  getAllocatedCount(ClientId) {
    this.allocatedCountList = [];
    this.pcnService.getAllocatedCount(ClientId).subscribe((response) => {
      console.log('getAllocatedCount() response : ', response);
      this.allocatedCountList = response.Data;
      this.ResponseHelper.GetSuccessResponse(response);
    }, (error) => {
      this.allocatedCountList = [];
      this.ResponseHelper.GetFaliureResponse(error);
      console.log('error : ', error);
    })
  }

  opeAllocatedCount(obj, key) {
    console.log('opeAllocatedCount() : ', obj, key, this.allocatedCountList);
    this.activeAllocatedCount = [];
    if (obj && obj.Buckets != 'Allocated ##') {
      return true;
    }
    this.allocatedCountList.forEach((element) => {
      if (element && element.Bucket_Name.toLowerCase() == key.toLowerCase()) {
        this.activeAllocatedCount = element.allocated_Counts;
        return true;
      }
      else {
        if (element && element.Bucket_Name == 'Paid_Without_EOB' && key == 'Paid_NO_EOB') {
          this.activeAllocatedCount = element.allocated_Counts;
          return true;
        }
        if (element && element.Bucket_Name == 'Paid_With_EOB' && key == 'Paid_EOB_Availble') {
          this.activeAllocatedCount = element.allocated_Counts;
          return true;
        }
      }
    });

    this.showAllocatedCountModal = true;
    console.log('opeAllocatedCount : ', this.activeAllocatedCount);
  }

  closeAllocatedCount() {
    this.showAllocatedCountModal = false;
  }
}


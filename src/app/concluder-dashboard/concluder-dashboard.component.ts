import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/service/notification.service';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// import * as moment from 'moment';
import { Router } from '@angular/router';
import { Token } from '../manager/token';
import { PcnService } from '../service/pcn.service';

import * as _ from 'lodash';
// import { max } from 'rxjs-compat/operator/max';
// import { LiteralArrayExpr } from '@angular/compiler';
// import { count } from 'rxjs-compat/operator/count';

@Component({
  selector: 'app-concluder-dashboard',
  templateUrl: './concluder-dashboard.component.html',
  styleUrls: ['./concluder-dashboard.component.css']
})
export class ConcluderDashboardComponent implements OnInit {
  // 
  showInfomodal = false;
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
  activeBucket = null;
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

      this.setRAGValues();
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
    // console.log()
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
        if (data[key] > 0) {
          const result = (data[key] * 100).toFixed(2);
          data[key] = Number(result) > 0 ? Number(result) + '%' : '0%'
        }
      }
    });
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
    if (obj && obj[key] == 0) {
      return null;
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
    this.activeBucket = this.replaceBucketName(key);
    this.showAllocatedCountModal = true;
    console.log('opeAllocatedCount this.activeBucket : ', this.activeBucket);
  }

  closeAllocatedCount() {
    this.showAllocatedCountModal = false;
    this.search();
  }

  replaceBucketName(Bucket_Name) {
    console.log('replaceBucketName :', Bucket_Name)
    var activeBucket = Bucket_Name;
    switch (Bucket_Name) {
      case 'Paid_NO_EOB':
        activeBucket = 'Paid_Without_EOB';
        break;
      case 'Paid_EOB_Availble':
        activeBucket = 'Paid_With_EOB';
        break;
      default:
        break;
    }
    return activeBucket
  }

  setRAGValues() {
    console.log('setRAGValues() : ', this.dashboardData);
    let mainArray = [];
    var keyList = ["To_Be_Concluded",
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
      "No_Response_Calling"]
    this.dashboardData.forEach((row) => {
      // console.log('row : ', row);
      if (row.Buckets == '%%%_##' || row.Buckets == '%%_$$') {
        this.setPercentage(row, keyList)
        return false;
      }
      mainArray = [];
      keyList.forEach((key) => {
        console.log(`row[${key}] : `, row[key], key);
        if (key != "To_Be_Concluded" && row[key] != null && row[key] != undefined && row[key] > 0) {
          mainArray.push({ 'value': Number(row[key]), 'key': key })
        }
      })
      // console.log('mainArray : ', mainArray);
      if (mainArray != undefined && mainArray.length > 0) {
        this.calculate(row, mainArray)
      }
      // else if (row.Buckets == '%%%_##' || row.Buckets == '%%_$$') {
      //   // mainArray.push({ 'value': Number(row[key]), 'key': key })
      //   this.setPercentage(row, mainArray)
      //   // return false;
      // }
    });
  }

  setPercentage(row, keyList) {
    // console.log('setPercentage : ', row);
    row.report = {};
    keyList.forEach((key) => {
      // console.log(`setPercentage row[${key}] : `, row[key], key);
      if (key == "To_Be_Concluded" && row[key] != null && row[key] != undefined && row[key] > 0) {
        const result = row[key] * 100;
        console.log('result percenteage : ', result)
        switch (true) {
          case result < 50: {
            //row.report[key] = '#f03434'; // red
            row.report[key] = '#26c281'; // green
            break;
          }
          case (result >= 50 && result < 75): {
            row.report[key] = '#FFC200';
            break;
          }

          case result >= 75: {
            //row.report[key] = '#26c281'; // green
            row.report[key] = '#f03434'; // red
            break;
          }
          default:
            break;
        }
        console.log('typeof row[key] : ', row[key], typeof row[key]);
      }
    })
  }

  calculate(row, array) {
    // if (row.Buckets == 'Pending ##' || row.Buckets == 'Pending $$') {
    //     return false;
    //   }
    const finalArray = [];
    var chartArray = [];
    // console.log('(row, array) : ', row, array);
    var maxNum = _.maxBy(array, 'value');
    console.log("maxNum : ", maxNum);
    var minNum = _.minBy(array, 'value');
    console.log("minNum : ", minNum);
    // if (maxNum = undefined && minNum == undefined) {
    //   return null;
    // }
    finalArray.push({ key: maxNum.key, color: "#f03434" }); //red
    if (minNum.value > 0) {
      finalArray.push({ key: minNum.key, color: "#26c281" }); // green
    }
    const sum = _.sumBy(array, 'value');
    var mainHalf = (maxNum.value + minNum.value) / 2;
    var firstHalf = (minNum.value + mainHalf) / 2;
    // firstHalf = this.sumBetweenTwoNumbers(minNum.value, mainHalf, array);
    console.log("mainHalf : ", mainHalf, sum, finalArray, maxNum, minNum);
    console.log('calc now firstHalf : ', firstHalf, mainHalf);
    var secondHalf = (maxNum.value + mainHalf) / 2;
    // secondHalf = this.sumBetweenTwoNumbers(mainHalf, maxNum.value, array);
    console.log('calc now secondHalf : ', secondHalf, mainHalf);
    chartArray.push({ value: minNum.value, type: 'smallest' });
    chartArray.push({ value: firstHalf, type: 'first half' });
    chartArray.push({ value: mainHalf, type: 'middle' });
    chartArray.push({ value: secondHalf, type: 'second half' });
    chartArray.push({ value: maxNum.value, type: 'largest' });
    array.forEach((ele) => {
      // var firstHalf;// = Math.ceil((minNum.value + mainHalf) / 2);
      // firstHalf = this.sumBetweenTwoNumbers(minNum.value, mainHalf, array);

      // if (ele.value == minNum.value || ele.value == mainHalf || ele.value == maxNum.value) {
      //   return null;
      // }
      switch (true) {
        case (ele.value >= minNum.value) && ele.value <= mainHalf: {
          console.log('less than middle : ', row.Buckets, firstHalf);
          if (ele.value > firstHalf) {
            finalArray.push({ key: ele.key, color: "#FFC200", value: ele.value }); // amber
          } else if (ele.value > 0) {
            finalArray.push({ key: ele.key, color: "#26c281", value: ele.value }); // green
          }
          else {
            //finalArray.push({ key: ele.key, color: "#2ecc71" }); //green
          }
          break;
        }
        case ele.value >= mainHalf && ele.value <= maxNum.value: {
          // var secondHalf; //= Math.ceil((maxNum.value + mainHalf) / 2);
          // secondHalf = this.sumBetweenTwoNumbers(mainHalf, maxNum.value, array);

          if (ele.value > secondHalf) {
            finalArray.push({ key: ele.key, color: "#f03434", value: ele.value }); // red
          } else {
            finalArray.push({ key: ele.key, color: "#FFC200", value: ele.value }); // amber
          }
          break;
        }
      }
    });
    // console.log('finalArray : ', finalArray);
    row.report = {};
    finalArray.forEach((ele) => {
      row.report[ele.key] = ele.color;
    });
    console.log('chartArray : ', JSON.stringify(chartArray));
  }

  sumBetweenTwoNumbers(start, end, array) {
    console.log('calc now sumBetweenTwoNumbers :', start, end, array);
    var sum = 0, total = 0;
    array.forEach(element => {
      if (element.value >= start && element.value >= end) {
        sum = sum + element.value;
        total = total + 1;
      }
    });
    return (sum / total);
  }
  closeModal() {
    this.showInfomodal = false;
  }

  openModal() {
    this.showInfomodal = true;
  }
}


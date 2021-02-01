import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { NotificationService } from 'src/app/service/notification.service';
import { ResponseHelper } from 'src/app/manager/response.helper';
// import { DeallocationByAgentByBucketService } from 'src/app/service/deallocation-by-agent-by-bucket.service';

import * as _ from 'lodash';
import { ConcluderService } from 'src/app/service/concluder.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-concluder-deallocation-page',
  templateUrl: './concluder-deallocation-page.component.html',
  styleUrls: ['./concluder-deallocation-page.component.css']
})
export class ConcluderDeallocationPageComponent implements OnInit, OnChanges {
  @Output() close = new EventEmitter();
  @Input() bucketList;
  @Input() employeeList;
  @Input() viewBy;
  @Input() ClientId;
  dropdownSettings;
  ResponseHelper: ResponseHelper;
  constructor(private concluderService: ConcluderService, private notification: NotificationService, private router: Router) {
    this.ResponseHelper = new ResponseHelper(this.notification);
  }

  ngOnInit() {
    console.log('ngOnInit viewBy : ', this.viewBy);
    console.log('ngOnInit bucketList : ', this.bucketList);
    console.log('ngOnInitemployeeList : ', this.employeeList);
    switch (this.viewBy) {
      case 'byAgent': {
        this.manageBucketByEmployees();
        break;
      }
      case 'byBucket': {
        this.manageEmployeesByBucket();
        break;
      }
      default:
        break;
    }
  }

  ngOnChanges(changes) {
    // console.log('viewBy, bucketList, employeeList : ', this.viewBy, this.bucketList, this.employeeList);

  }

  manageEmployeesByBucket() {
    const groupByBucket = _.groupBy(this.bucketList, 'BucketName')
    console.log('group by  : ', groupByBucket);
    this.bucketList = [];
    for (let key in groupByBucket) {
      const obj = { BucketName: key, employee: [] }
      groupByBucket[key].forEach((element) => {
        // obj.employee = this.employeeList.filter(employee => element.user_Id == employee.Id)
        this.employeeList.filter(employee => {
          if (element.user_Id == employee.Id) {
            obj.employee.push(employee);
          }
        });
      });
      this.bucketList.push(obj)
    }
    // this.bucketList.forEach((element) => {
    //   element.employee = this.employeeList.filter(employee => element.user_Id == employee.Id)
    // });
    // console.log('this.bucketList : ', this.bucketList);
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'Id',
      textField: 'Full_Name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true,
      noDataAvailablePlaceholderText: 'No bucket Found'
    };
  }

  manageBucketByEmployees() {
    // this.employeeList = _.uniq(this.employeeList, (employee) => employee.Employee_Code);
    const backupList = _.uniqBy(this.employeeList, 'User_Id');
    console.log('groupByEmployee : ', backupList);
    backupList.forEach((backup) => {
      backup.bucket = [];
      this.employeeList.forEach((element) => {
        if (backup.User_Id == element.User_Id) {
          backup.bucket.push({ Bucket_Name: element.Bucket_Name });
        }
      })
    })
    // this.employeeList.forEach((element) => {
    // element.bucket = this.bucketList;//.filter(bucket => element.Bucket_Name == bucket.Bucket_Name);
    // element.selectedBucket = this.bucketList.filter(bucket => element.Bucket_Name == bucket.Bucket_Name);
    // });
    this.employeeList = backupList; //_.uniq(this.employeeList, (employee) => employee.Employee_Code);
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'Bucket_Name',
      textField: 'Bucket_Name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true,
      noDataAvailablePlaceholderText: 'No bucket Found'
    };
    console.log('this.employeeList : ', this.employeeList);
  }

  allowDeallocate() {
    // return true;
    // const finalJSON
    let status = null;
    switch (this.viewBy) {
      case 'byBucket':
        {
          status = this.bucketList.find(bucket => {
            if (bucket.selectedEmployee && bucket.selectedEmployee.length > 0) {
              return bucket.selectedEmployee;
            }
          });
          console.log('status : ', status)
          break;
        }
      case 'byAgent':
        {
          status = this.employeeList.find(employee => {
            if (employee.selectedBucket && employee.selectedBucket.length > 0) {
              return employee.selectedBucket;
            }
          });
          console.log('status : ', status)
          break;
        }
      default:
        break;
    }
    return status;
  }

  Deallocate() {
    const finalJSON = [];
    // const mainObj = {
    //   "username": "",
    //   "userId": "",
    //   "bucketname": "",
    //   "EmpName_BucketName_UserId": "",
    //   "Full_Name": "",
    //   "Employee_Code": "",
    //   "Client_Id": ""
    // }

    console.log('Deallocate() : ', this.viewBy);
    switch (this.viewBy) {
      case 'byAgent': {
        console.log('byAgent :', this.employeeList);
        this.employeeList.forEach((employee) => {
          if (employee && employee.selectedBucket) {
            employee.selectedBucket.forEach((bucket) => {
              finalJSON.push({
                "username": employee.Username,
                "userId": employee.User_Id,
                "bucketname": bucket,
                "EmpName_BucketName_UserId": "",
                "Full_Name": employee.Employee_Name,
                "Employee_Code": employee.Employee_Code,
                "Client_Id": this.ClientId
              })
            })
          }
        });
        console.log('finalJSON : ', finalJSON);
        break;
      }
      case 'byBucket': {
        console.log('byAgent :', this.bucketList);

        this.bucketList.forEach(bucket => {
          if (bucket && bucket.selectedEmployee) {
            bucket.selectedEmployee.forEach(employee => {
              // console.log('employee : ', employee)
              let matchedEmployee = bucket.employee.find((element) => element.Id == employee.Id)
              finalJSON.push({
                "username": matchedEmployee.Client_User_Name,
                "userId": employee.Id,
                "bucketname": bucket.BucketName,
                "EmpName_BucketName_UserId": "",
                "Full_Name": employee.Full_Name,
                "Employee_Code": matchedEmployee.Employee_Code,
                "Client_Id": this.ClientId
              })
            });
          }
        });
        console.log('finalJSON : ', finalJSON);
        break;
      }
      default:
        break;
    }
    if (finalJSON == null || finalJSON.length == 0) {
      return true;
    }
    this.concluderService.deAllocateCOncluder(finalJSON).subscribe((response) => {
      console.log('deAllocateCOncluder response : ', response);
      this.closeModal(true);
      this.ResponseHelper.GetSuccessResponse(response);
    }, (error) => {
      console.log('deAllocateCOncluder error : ', error);
      this.ResponseHelper.GetFaliureResponse(error)
    })
  }

  closeModal(status) {
    this.close.emit(status);
  }

}

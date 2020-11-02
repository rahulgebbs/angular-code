import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import * as _ from 'lodash';
import { ProjectandpriorityService } from 'src/app/service/projectandpriority.service';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
@Component({
  selector: 'app-project-and-priority-deallocation-page',
  templateUrl: './project-and-priority-deallocation-page.component.html',
  styleUrls: ['./project-and-priority-deallocation-page.component.css']
})
export class ProjectAndPriorityDeallocationPageComponent implements OnInit, OnChanges {

  @Output() close = new EventEmitter();
  @Input() moduleList;
  @Input() employeeList;
  @Input() viewBy;
  @Input() ClientId;
  dropdownSettings;
  ResponseHelper: ResponseHelper;
  constructor(private projectandpriorityService: ProjectandpriorityService, private notification: NotificationService) {
    this.ResponseHelper = new ResponseHelper(this.notification);
  }

  ngOnInit() {
    console.log('ngOnInit viewBy : ', this.viewBy);
    console.log('ngOnInit bucketList : ', this.moduleList);
    console.log('ngOnInitemployeeList : ', this.employeeList);
    switch (this.viewBy) {
      case 'byAgent': {
        this.manageModuleByEmployees();
        break;
      }
      case 'byModule': {
        this.manageEmployeesByModule();
        break;
      }
      default:
        break;
    }
  }



  ngOnChanges(changes) {
    // console.log('viewBy, bucketList, employeeList : ', this.viewBy, this.bucketList, this.employeeList);
    // console.log('ngOnChanges viewBy : ', changes);
    // console.log('ngOnChanges moduleList : ', this.moduleList);
    // console.log('ngOnChanges employeeList : ', this.employeeList);
    // switch (this.viewBy) {
    //   case 'byAgent': {
    //     this.manageModuleByEmployees();
    //     break;
    //   }
    //   case 'byBucket': {
    //     this.manageEmployeesByModule();
    //     break;
    //   }
    //   default:
    //     break;
    // }
  }

  manageEmployeesByModule() {
    const groupByBucket = _.groupBy(this.employeeList, 'Project_Name')
    console.log('group by  : ', groupByBucket);
    this.moduleList = [];
    for (let key in groupByBucket) {
      const obj = { Project_Name: key, employee: [] }
      obj.employee = groupByBucket[key];
      // groupByBucket[key].forEach((element) => {
      //   // obj.employee = this.employeeList.filter(employee => element.user_Id == employee.Id)
      //   this.employeeList.filter(employee => {
      //     if (element.user_Id == employee.Id) {
      //       obj.employee.push(employee);
      //     }
      //   });
      // });
      obj.employee = _.uniqBy(obj.employee, 'Employee_Code');
      this.moduleList.push(obj);
    }
    // this.moduleList = _.uniqBy(this.moduleList, 'Employee_Code')
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'User_Id',
      textField: 'Employee_Name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true,
      noDataAvailablePlaceholderText: 'No employeess Found'
    };
    console.log('Project_Name : ', this.moduleList);
  }

  manageModuleByEmployees() {
    this.employeeList = _.uniq(this.employeeList, (employee) => employee.Employee_Code);
    const backupList = _.uniqBy(this.employeeList, 'Employee_Code');
    console.log('groupByEmployee : ', backupList, this.moduleList);
    backupList.forEach((backup) => {
      backup.modules = [];
      this.moduleList.forEach((element) => {
        if (backup.Employee_Code == element.Employee_Code) {
          backup.modules.push({ Project_Name: element.Project_Name });
        }
      });
    })
    // // this.employeeList.forEach((element) => {
    // // element.bucket = this.bucketList;//.filter(bucket => element.Bucket_Name == bucket.Bucket_Name);
    // // element.selectedBucket = this.bucketList.filter(bucket => element.Bucket_Name == bucket.Bucket_Name);
    // // });
    this.employeeList = backupList; //_.uniq(this.employeeList, (employee) => employee.Employee_Code);
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'Project_Name',
      textField: 'Project_Name',
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
      case 'byModule':
        {
          status = this.moduleList.find(bucket => {
            if (bucket.selectedEmployee && bucket.selectedEmployee.length > 0) {
              return bucket.selectedEmployee;
            }
          });
          // console.log('status : ', status)
          break;
        }
      case 'byAgent':
        {
          status = this.employeeList.find(employee => {
            if (employee.selectedModule && employee.selectedModule.length > 0) {
              return employee.selectedModule;
            }
          });
          // console.log('status : ', status)
          break;
        }
      default:
        break;
    }
    return status;
  }

  Deallocate() {
    console.log('Deallocate() : ', this.moduleList, this.employeeList);
    const finalJSON = [];
    // // const mainObj = {
    // //   "username": "",
    // //   "userId": "",
    // //   "bucketname": "",
    // //   "EmpName_BucketName_UserId": "",
    // //   "Full_Name": "",
    // //   "Employee_Code": "",
    // //   "Client_Id": ""
    // // }

    // console.log('Deallocate() : ', this.viewBy);
    switch (this.viewBy) {
      case 'byAgent': {
        // console.log('byAgent :', this.employeeList);
        let obj = {
          projectName: null,
          data: []
        }
        this.employeeList.forEach((employee) => {

          if (employee && employee.selectedModule && employee.selectedModule.length > 0) {

            employee.selectedModule.forEach((module) => {
              let matchedEmployee = this.moduleList.find((element) => element.Project_Name == module && employee.Employee_Code == element.Employee_Code);
              // console.log('byAgent matchedEmployee : ', this.viewBy, matchedEmployee);
              obj.projectName = module;
              obj.data.push({
                "clientId": this.ClientId,
                "employeeId": matchedEmployee.User_Id,
                "employeeCode": matchedEmployee.Employee_Code,
                "fullName": matchedEmployee.Employee_Name,
                "userName": matchedEmployee.Username
              });
            });
          }
        });
        finalJSON.push(obj);
        this.deAllocateByAgent(finalJSON);
        // console.log('finalJSON : ', finalJSON);
        break;
      }
      case 'byModule': {
        // console.log('byAgent :', this.bucketList);
        let obj = {
          projectName: null,
          data: []
        }
        this.moduleList.forEach(module => {
          if (module && module.selectedEmployee && module.selectedEmployee.length > 0) {
            obj.projectName = module.Project_Name;
            module.selectedEmployee.forEach(employee => {
              // console.log('employee : ', employee)
              let matchedEmployee = module.employee.find((element) => element.User_Id == employee.User_Id);
              // console.log('matchedEmployee : ', this.viewBy, matchedEmployee);
              obj.data.push({
                "clientId": this.ClientId,
                "employeeId": matchedEmployee.User_Id,
                "employeeCode": matchedEmployee.Employee_Code,
                "fullName": matchedEmployee.Employee_Name,
                "userName": matchedEmployee.Username
              })
            });
          }
        });
        finalJSON.push(obj);
        this.deAllocateByModule(finalJSON);
        break;
      }
      default: {
        break;
      }
    }
    console.log(this.viewBy, 'finalJSON : ', finalJSON);
    // const { Project_Name,data } = finalJSON;
  }

  deAllocateByModule(formBody) {
    this.projectandpriorityService.deAllocateByModule(formBody).subscribe((response) => {
      console.log('response : ', response);
      this.ResponseHelper.GetSuccessResponse(response);
      this.closeModal(true);
    }, (error) => {
      console.log('error : ', error);
      this.ResponseHelper.GetFaliureResponse(error);
    })
  }

  deAllocateByAgent(formBody) {
    this.projectandpriorityService.deAllocateByAgent(formBody).subscribe((response) => {
      console.log('response : ', response);
      this.ResponseHelper.GetSuccessResponse(response);
      this.closeModal(true);
    }, (error) => {
      console.log('error : ', error);
      this.ResponseHelper.GetFaliureResponse(error);
    })
  }

  manageModuleRadiobutton() {
    console.log('manageEmployeeRadiobutton() : ', this.employeeList);
    this.moduleList.forEach((module) => {
      module.selectedEmployee = [];

    });
  }

  manageEmployeeRadiobutton() {
    console.log('manageEmployeeRadiobutton() : ', this.employeeList);
    this.employeeList.forEach((employee) => {
      employee.selectedModule = [];

    });
  }

  closeModal(status) {
    this.close.emit(status);
  }

}

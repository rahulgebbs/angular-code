import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Token } from 'src/app/manager/token';
import { dropDownFields } from 'src/app/manager/dropdown-feilds';
import { DeallocationByAgentByBucketService } from 'src/app/service/deallocation-by-agent-by-bucket.service';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
import { ConcluderService } from 'src/app/service/concluder.service';


@Component({
  selector: 'app-concluder-deallocation',
  templateUrl: './concluder-deallocation.component.html',
  styleUrls: ['./concluder-deallocation.component.css'],
  providers: [dropDownFields]
})
export class ConcluderDeallocationComponent implements OnInit {

  title = "De-Allocation";
  AgentdeallocationForm: FormGroup;
  ClientList: any[] = [];
  userdata;
  UserId: number;
  ClientId = "";
  showOptionButtons: boolean = false;
  ShowAgentModal: boolean = false;
  ShowBucketModal: boolean = false;
  BucketName = [];
  ResponseHelper: ResponseHelper;
  checkevent: boolean = false;
  validated;
  bucketList;
  empList;
  empName = [];
  GetEmployeeName;
  AllBucketByEmpList;

  checklist = "";


  constructor(public fb: FormBuilder, private router: Router, private drpService: dropDownFields, private DeallocationService: DeallocationByAgentByBucketService, private notification: NotificationService, private concluderService: ConcluderService) {
    this.ResponseHelper = new ResponseHelper(this.notification);
    this.AgentdeallocationForm = this.fb.group({
      ["ClientId"]: [],
      ["checklist"]: []
    });
  }
  ngOnInit() {
    let token = new Token(this.router);
    this.userdata = token.GetUserData();
    this.UserId = this.userdata.UserId;
    //this.ClientList = this.drpService.setSelected(this.userdata.Clients)
    this.ClientList = this.setSelectedDropdown(this.userdata.Clients)
    if (this.ClientList[0].selected == true) {
      this.showOptionButtons = true;
      this.ClientId = this.ClientList[0].Client_Id
      // this.ClientSelectDropdown(event)
    }
    //this.selectedValue(this.ClientList);
  }

  submitFrom() {
    this.AgentdeallocationForm.reset();
  }

  //to display option button
  ClientListOnChange(event) {
    console.log('ClientListOnChange : ', event);
    this.showOptionButtons = true;

    if (!event.target.value || event.target.value == "0") {
      //this.DisableEmployeeSelect = true;
    }
    else {
      this.ClientId = event.target.value;
      this.GetBucketNames();
      this.GetEmpNames();
    }
  }

  GetBucketNames() {
    this.bucketList = [];
    this.empList = [];
    this.concluderService.getBucketsByEmployee(this.ClientId).subscribe(
      res => {
        console.log('GetBucketNames res : ', res);
        // const response = {
        //   "Message": [
        //     {
        //       "Message": "Employee list.",
        //       "Type": "SUCCESS"
        //     }
        //   ],
        //   "Data": {
        //     "buckets": [
        //       {
        //         "Bucket_Name": "To_Be_Concluded"
        //       }
        //     ],
        //     "employees": [
        //       {
        //         "Employee_Code": "33603",
        //         "User_Id": 11621,
        //         "Bucket_Name": "To_Be_Concluded",
        //         "Employee_Name": "Akshay Aswale",
        //         "Username": "33603"
        //       },
        //       {
        //         "Employee_Code": "753",
        //         "User_Id": 11625,
        //         "Bucket_Name": "To_Be_Concluded",
        //         "Employee_Name": "Akshay aswale agent2",
        //         "Username": "Akshay_agent2"
        //       }
        //     ]
        //   }
        // }
        // this.bucketList = res.json().Data.Bucket_Info;
        // this.empList = res.json().Data.Emp_Details_By_Bucket_Info;
        // this.bucketList.forEach(e => {
        //   e.Is_Selected = false;

        // })
      },
      err => {
        console.log('GetBucketNames err : ', err);
        this.ResponseHelper.GetFaliureResponse(err)
      }
    )
  }

  GetEmpNames() {
    this.GetEmployeeName = [];
    this.concluderService.getEmployeesByBucket(this.ClientId).subscribe(
      res => {
        console.log('getEmployeesByBucket res : ', res)
        // const response = {
        //   "Message": [
        //     {
        //       "Message": "Employee list.",
        //       "Type": "SUCCESS"
        //     },
        //     {
        //       "Message": "Clients User List.",
        //       "Type": "SUCCESS"
        //     }
        //   ],
        //   "Data": {
        //     "Emp_Info": [
        //       {
        //         "Id": 11621,
        //         "Client_User_Name": "33603",
        //         "Employee_Code": "33603",
        //         "Full_Name": "Akshay Aswale"
        //       }
        //     ],
        //     "BucketName_By_Emp_Info": [
        //       {
        //         "BucketName": "To_Be_Concluded",
        //         "Value": "",
        //         "user_Id": 11621
        //       }
        //     ]
        //   }
        // };
        // this.GetEmployeeName = res.json().Data.Emp_Info;
        // this.AllBucketByEmpList = res.json().Data.BucketName_By_EmpId_Info;
        // this.GetEmployeeName.forEach(e => {
        //   e.Is_Selected = false;

        // })
      },
      err => {
        this.ResponseHelper.GetFaliureResponse(err);
        console.log('getEmployeesByBucket err : ', err);
      }
    )
  }
  //display model

  OpenByBucket(event) {
    //this.GetBucketNames();
    this.ShowBucketModal = true;
  }
  OpenByAgent(event) {
    this.ShowAgentModal = true;
  }
  //close Modal
  CloseBucketModal() {
    this.ShowBucketModal = false;
    this.ClientId = "";
    this.checklist = "";
    this.showOptionButtons = false;
  }
  CloseAgentModal() {
    this.ShowAgentModal = false;
    this.ClientId = "";
    this.checklist = "";
    this.showOptionButtons = false;
  }
  BucketValid() {
    this.checkevent = true
    this.validated = true
  }

  setSelectedDropdown(data) {
    if (data && data.length >= 1) {
      data[0].selected = false
      return data
    } else {
      data[0].selected = true
      return data
    }
  }
  ClientSelectDropdown(event) {
    console.log('ClientSelectDropdown($event) : ', event);
  }
}

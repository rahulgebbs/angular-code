import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Token } from 'src/app/manager/token';
import { NotificationService } from 'src/app/service/notification.service';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
@Component({
  selector: 'app-project-and-priority-dashboard',
  templateUrl: './project-and-priority-dashboard.component.html',
  styleUrls: ['./project-and-priority-dashboard.component.css']
})
export class ProjectAndPriorityDashboardComponent implements OnInit {
  ResponseHelper: ResponseHelper;
  dashboardForm: FormGroup;
  typeList = ['All', 'Active', 'Inactive'];
  constructor(private router: Router, private notification: NotificationService, public fb: FormBuilder) {
    this.ResponseHelper = new ResponseHelper(this.notification);
    this.dashboardForm = this.fb.group({
      "dashboardType": ['']
    });
  }

  ngOnInit() {
  }
  
  typeChange() {
    console.log('typeChange() : ', this.dashboardForm.value);
  }

}

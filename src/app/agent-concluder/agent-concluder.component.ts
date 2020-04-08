import { Component, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { Token } from 'src/app/manager/token';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
@Component({
  selector: 'app-agent-concluder',
  templateUrl: './agent-concluder.component.html',
  styleUrls: ['./agent-concluder.component.css']
})
export class AgentConcluderComponent implements OnInit {
  ResponseHelper: ResponseHelper;
  userData;
  token: Token;
  Title = 'User Menu Mapping';
  rowData;
  columnDefs;
  gridOptions: any = {
    context: {
      componentParent: this
    },
    // rowClassRules: {
    //   'highLight-row': function (params) {
    // console.log('highLight-row : ', params.data)
    //     return params.data.active == true;
    //   }
    // },
    force: true
  };

  constructor(
    private router: Router,
    private notification: NotificationService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.columnDefs = [
      { headerName: 'Account Number', field: 'Account_Number' },

      { headerName: 'Practice', field: 'Practice' },
      { headerName: 'Insurance Name', field: 'Insurance_Name' },
      { headerName: 'CPT', field: 'CPT' },
      { headerName: 'Charge Amount', field: 'Charge_Amount' },
      { headerName: 'Balance Amount', field: 'Balance_Amount' },
      { headerName: 'DOB', field: 'DOB' },
      { headerName: 'DOS', field: 'DOS' },
    ];
    this.rowData = [];
  }
}

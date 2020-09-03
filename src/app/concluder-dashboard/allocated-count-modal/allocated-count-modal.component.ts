import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ConcluderService } from 'src/app/service/concluder.service';
import { Router } from '@angular/router';
import { Token } from 'src/app/manager/token';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-allocated-count-modal',
  templateUrl: './allocated-count-modal.component.html',
  styleUrls: ['./allocated-count-modal.component.scss']
})
export class AllocatedCountModalComponent implements OnInit {

  ShowModal = true
  @Input() AllocatedCountsData;
  @Input() Client_ID;
  @Input() activeBucket;
  rowData;
  gridApi;
  gridColumnApi
  rowSelection = 'single'
  @Output() close = new EventEmitter<any>();
  agentList = [];
  clientSetting = {
    singleSelection: true,
    idField: 'Employee_Code',
    textField: 'Full_Name',
    itemsShowLimit: 3,
    closeDropDownOnSelection: true,
    allowSearchFilter: true
  }
  showReAllocation = false;
  columnDefs = [
    {
      headerName: 'Allocated to', field: 'Allocated_To', suppressSizeToFit: true
    },
    {
      headerName: 'Allocated Count', field: 'Account_Count', suppressSizeToFit: true, cellStyle: function (params) {
        return { textAlign: 'center' };

      }
    },
    {
      headerName: "Action", cellRenderer: this.showCellRenderer, suppressSizeToFit: true
    }
  ];
  token: Token;
  userData: any = null;
  activeAgent = null;
  selectedAgentList = null;
  submitStatus = false;
  constructor(private concluderService: ConcluderService, public router: Router, private notification: NotificationService) { }

  ngOnInit() {
    console.log('AllocatedCountsData : ', this.activeBucket);
    this.token = new Token(this.router);
    this.userData = this.token.GetUserData();
    console.log('this.userData : ', this.userData);
    this.rowData = this.AllocatedCountsData;
    this.AllocatedCountsData.forEach(element => {
      element.Allocated_To = element.Allocated_To && element.Allocated_To.length > 0 ? element.Allocated_To : "N/A";
    });

    setTimeout(() => {
      // this.rowData = JSON.parse(JSON.stringify(this.rowData));
      // this.sizeToFit();
      this.autoSizeAll(true);
    }, 500);

  }
  showCellRenderer(params) {
    var eGui: any = document.createElement("div");
    eGui.innerHTML = `<button  class="btn label gray label-info square-btn cursor" data-action-type="update" title="Re-Allocate">Re-Allocate</button>`;
    return eGui;
  }
  getData(params) {
    console.log('params : ', params.colDef.headerName);
    this.activeAgent = params.data;
    this.getAllocatedCountList(this.Client_ID, this.activeAgent.Employee_Code, this.activeBucket.replace(/_/g, "_"));

  }
  getAllocatedCountList(clientId, Employee_Code, bucket_name) {
    console.log('clientId,Employee_Code,bucket_name : ', clientId, Employee_Code, bucket_name);
    this.agentList = [];
    this.showReAllocation = true;
    this.concluderService.getUnWorkedAccounts(clientId, Employee_Code, bucket_name).subscribe((response) => {
      console.log('response : ', response);
      if (response && response.Data) {
        const { Data } = response;
        if (Data.Account_Count > 0) {
          this.getAllEmployeeByClient(this.Client_ID);
        }
        else {
          this.notification.ChangeNotification([{ Message: "No Accounts to Re-Allocate", Type: "ERROR" }])
          this.showReAllocation = false;
        }
      }
    }, (error) => {
      console.log('response : ', error);
      this.showReAllocation = false;
      this.notification.ChangeNotification(error.Message);
    })
  }

  getAllEmployeeByClient(clientId) {
    this.concluderService.getAllEmployeeByClient(clientId).subscribe((response) => {
      console.log('getAllEmployeeByClient response : ', response.Data, this.activeAgent);
      this.showReAllocation = true;
      this.agentList = JSON.parse(JSON.stringify(response.Data));
      this.removeAgent();
    }, (error) => {
      console.log('getAllEmployeeByClient error : ', error);
      this.showReAllocation = true;
    })
  }

  removeAgent() {
    console.log('removeAgent() : ', this.activeAgent, this.agentList);
    this.agentList.forEach((agent, index) => {
      if (agent.Full_Name == this.activeAgent.Allocated_To) {
        this.agentList.splice(index, 1);
      }
    })
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // params.columnApi.autoSizeColumns();
    // params.api.sizeColumnsToFit();
    // this.sizeToFit()
    // this.autoSizeAll(false)
  }

  dismissModel() {
    this.close.emit();
  }
  sizeToFit() {
    if (this.gridApi)
      this.gridApi.sizeColumnsToFit();

    console.log('this.gridApi : ', this.gridApi);
  }
  autoSizeAll(skipHeader) {
    var allColumnIds = [];
    if (this.gridColumnApi) {
      this.gridColumnApi.getAllColumns().forEach(function (column) {
        allColumnIds.push(column.colId);
      });
      this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
    }
    console.log('autoSizeAll : ', skipHeader, this.gridColumnApi);
  }

  allocateAccount() {
    // console.log('allocateAccount() : ', this.activeAgent);
    const finalObj = {
      "Client_id": this.Client_ID,
      "Allocated_To": this.activeAgent.Employee_Code,
      "Account_Count": this.activeAgent.Account_Count,
      "Bucket_Name": this.activeBucket.replace(/_/g, "_"),
      "Employee_Codes": this.selectedAgentList.map(agent => Number(agent.Employee_Code))

    };
    console.log('finalObj : ', finalObj);
    this.concluderService.updateConclusionData(finalObj).subscribe((response) => {
      console.log('response :', response)
      this.dismissModel();
    }, (error) => {
      this.dismissModel();
      console.log('error :', error)
    });
  }
  // autoSizeAll(skipHeader) {
  //   var allColumnIds = [];
  //   if (this.gridColumnApi) {
  //     this.gridColumnApi.getAllColumns().forEach(function (column) {
  //       // console.log('column : ', column);
  //       const coldId = column.colId;
  //       if (coldId == 'template') {
  //         allColumnIds.push(column.colId);
  //       }
  //     });
  //     this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
  //   }

  // }
}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConcluderService } from 'src/app/service/concluder.service';
import * as _ from 'lodash';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
// import { NotificationService } from '../service/notification.service';


@Component({
  selector: 'app-concluder-accounts',
  templateUrl: './concluder-accounts.component.html',
  styleUrls: ['./concluder-accounts.component.css']
})
export class ConcluderAccountsComponent implements OnInit {
  @Input() ClientId;
  @Input() UserId;
  @Output() conclusionRowClick = new EventEmitter();
  @Output() CloseModal = new EventEmitter()
  concluderId;
  AccountsList = [];
  RowSelection = "single";
  columnDefs = []
  allData = [];
  gridOptions: any = {

    context: {
      componentParent: this
    }
  };

  ResponseHelper: ResponseHelper;
  bucketList = [];
  activeBucket = null;
  activeFieldList = [];
  constructor(private concluderService: ConcluderService, private notificationservice: NotificationService) {
    this.ResponseHelper = new ResponseHelper(this.notificationservice);
  }
  ngOnInit() {
    this.columnDefs = [];
    this.getConcludedAccounts();
  }

  getConcludedAccounts() {

    this.concluderService.getConcludedBucketCount(this.ClientId).subscribe((response) => {
      console.log('response : ', response);
      this.bucketList = response.Data;
      this.ResponseHelper.GetSuccessResponse(response);
    }, (error) => {
      console.log('error : ', error);
      this.ResponseHelper.GetFaliureResponse(error);
    })
  }

  getDataByBucketName(bucketName) {
    if (this.AccountsList == null) {
      return false;
    }
    this.AccountsList = null;
    // this.gridOptions.api.showLoadingOverlay();
    this.activeBucket = bucketName
    this.concluderService.getConclusionDataByBucket(this.ClientId, this.UserId, bucketName).subscribe((response) => {
      console.log('getConcludedBucketCount response : ', response);
      this.allData = response.Data;
      // setTimeout(() => {
      this.formatInventory();
      this.ResponseHelper.GetSuccessResponse(response);
      // }, 2000);
    }, (error) => {
      this.AccountsList = [];
      this.ResponseHelper.GetFaliureResponse(error);
      console.log('getConcludedBucketCount error : ', error);
    })
  }
  formatInventory() {
    const list = [];
    this.allData.forEach((data) => {
      const obj = {};
      data.forEach((field) => {
        this.columnDefs.push({ headerName: field.Header_Name, field: field.Header_Name });
        obj[field.Header_Name] = field.Field_Value;
      });
      obj["Bucket_Name"] = "Concluded";
      list.push(obj);
    });
    this.columnDefs = _.uniqBy(this.columnDefs, (column) => {
      return column.headerName;
    });
    this.AccountsList = JSON.parse(JSON.stringify(list));
    // console.log('this.AccountsList : ', this.AccountsList, this.columnDefs);i
    this.getAllFields(this.AccountsList[0], false);
  }
  Close() {
    this.CloseModal.emit();
  }
  getAllFields(data, status) {
    this.concluderId = data.Concluder_Id;
    console.log('getAllFields() : ', data.Concluder_Id, this.concluderId);
    sessionStorage.setItem('conclusionBucket', this.activeBucket);
    this.concluderService.getConclusionDataByConcludeID(this.ClientId, this.concluderId, this.activeBucket).subscribe((response) => {
      console.log('getConclusionDataByConcludeID response : ', response);
      this.activeFieldList = response.Data;
      this.closeModal(status);
    }, (error) => {
      console.log('getConclusionDataByConcludeID error : ', error);
    })
  }

  closeModal(status) {
    this.activeFieldList.forEach((field) => {
      field['Is_View_Allowed_Agent'] = true;
    });
    this.conclusionRowClick.emit({ status: status, AccountsList: this.activeFieldList, concluderId: this.concluderId, popup: status });
    this.saveIntoLocal();
  }

  saveIntoLocal() {
    sessionStorage.setItem('concluderAccounts', JSON.stringify(this.allData));
  }
}

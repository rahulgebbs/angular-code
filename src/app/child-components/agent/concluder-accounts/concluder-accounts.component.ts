import { Component, OnInit, Input } from '@angular/core';
import { ConcluderService } from 'src/app/service/concluder.service';


@Component({
  selector: 'app-concluder-accounts',
  templateUrl: './concluder-accounts.component.html',
  styleUrls: ['./concluder-accounts.component.css']
})
export class ConcluderAccountsComponent implements OnInit {
  @Input() ClientId;
  @Input() UserId;
  AccountsList = [];
  RowSelection = "single";
  columnDefs = []
  constructor(private concluderService: ConcluderService) { }
  bucketList = []
  ngOnInit() {
    this.columnDefs = [
      { field: 'Inventory_Id', hide: true, rowGroupIndex: null },
      // { headerName: this.PayerName, field: this.PayerName },
      {
        headerName: 'TFL Status', field: 'TFL_Status'
      },
      { headerName: 'Days', field: 'Days' },
      { headerName: 'Amount ($)', field: 'Dollar_Value' },
      { headerName: 'V/N', field: 'Voice_NonVoice' },
      { headerName: 'Completion Date', field: 'Completion_Date' },
      { headerName: 'Encounter No', field: 'Encounter_Number' },
      { headerName: 'Account No', field: 'Account_Number' }
    ]
    this.getConcludedAccounts();
  }

  getConcludedAccounts() {

    this.concluderService.getConcludedBucketCount(this.ClientId).subscribe((response) => {
      console.log('response : ', response);
      this.bucketList = response.Data;
    }, (error) => {
      console.log('error : ', error);
    })
  }

  getDataByBucketName(bucketName) {
    this.concluderService.getConclusionDataByBucket(this.ClientId,this.UserId,bucketName).subscribe((response) => {
      console.log('getConcludedBucketCount response : ', response);
    }, (error) => {
      console.log('getConcludedBucketCount error : ', error);
    })
  }
  Close() {

  }
}

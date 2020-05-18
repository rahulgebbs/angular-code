import { Component, OnInit, OnChanges, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';

import * as _ from 'lodash'
import { PcnService } from 'src/app/service/pcn.service';
import { getPCNData, fixedPCNFields } from './getPCNData';
import { ClipboardService } from 'ngx-clipboard'
import { NotificationService } from 'src/app/service/notification.service';
import { ResponseHelper } from 'src/app/manager/response.helper';


@Component({
  selector: 'app-add-pcn-modal',
  templateUrl: './add-pcn-modal.component.html',
  styleUrls: ['./add-pcn-modal.component.scss']
})
export class AddPcnModalComponent implements OnInit, OnChanges {
  addPCNForm: FormGroup;
  @Input() inventory;
  @Input() SaagLookup;
  @Output() close = new EventEmitter();
  // @Output() save = new EventEmitter();
  pcnList: any;
  disableBtn = false;
  keyList = [];

  localPCN = [];

  fixedPCNFields = fixedPCNFields;
  pcnInfo = [];
  submitBtnStatus = false;
  ResponseHelper: ResponseHelper;
  constructor(private fb: FormBuilder, private pcnService: PcnService, private _clipboardService: ClipboardService, private notification: NotificationService) { }

  ngOnInit() {

    // this.addPCN();
  }

  copyText(text) {
    this._clipboardService.copyFromContent(text);
    this.notification.ChangeNotification([{ Message: "Text Copied successfully!", Type: "SUCCESS" }])
  }

  ngOnChanges(changes) {
    console.log('changes : ', changes);
    this.ResponseHelper = new ResponseHelper(this.notification);
    this.manageKeyList();
    this.addPCNForm = this.fb.group({
      pcnList: this.fb.array([])
    });
    this.getPCNInfo();
  }

  getPCNInfo() {
    const { Client_Id, Inventory_Id, Inventory_Log_Id } = this.inventory;
    this.pcnService.getPCNForInventory(Client_Id, Inventory_Id, Inventory_Log_Id).subscribe((response: any) => {
      console.log('response : ', response);
      // this.addNewPCN();
      this.pcnInfo = response.Data;
      this.setUpNewPCN();
    }, (error) => {
      console.log('error : ', error);
      this.ResponseHelper.GetFaliureResponse(error);
      this.addNewPCN();
    })
    // console.log('getPCNData : ', getPCNData);
    // if (getPCNData != null) {
    //   this.pcnInfo = getPCNData;
    //   this.pcnInfo.forEach((pcnList) => {
    //     this.fixedPCNFields = JSON.parse(JSON.stringify(pcnList));
    //     this.setFieldType();
    //     console.log('pcnList : ', pcnList, this.fixedPCNFields);
    //   });
    //   this.setDropdownFields();
    // }
    // else {
    //   this.addNewPCN();
    // }
    // this.addNewPCN();
  }

  setUpNewPCN() {
    console.log('getPCNData : ', getPCNData);
    if (this.pcnInfo != null && this.pcnInfo.length > 0) {
      // this.pcnInfo = getPCNData;
      this.pcnInfo.forEach((pcnList) => {
        this.fixedPCNFields = JSON.parse(JSON.stringify(pcnList));
        this.setFieldType();
        console.log('pcnList : ', pcnList, this.fixedPCNFields);
      });
      this.setDropdownFields();
    }
    else {
      this.addNewPCN();
    }
  }

  addNewPCN() {
    this.fixedPCNFields = fixedPCNFields;
    this.fixedPCNFields.forEach((pcn: any) => {
      switch (pcn.Display_Header) {
        case 'InventoryId':
          pcn.FieldValue = this.inventory.Inventory_Id;
          break;
        case 'Inventory_Log_Id':
          pcn.FieldValue = this.inventory.Inventory_Log_Id;
          break;
        default:
          break;
      }
    })
    this.addPCN();
  }
  setDropdownFields() {
    // const pcnList = this.addPCN
    this.pcnInfo.forEach((pcnList, pcnListIndex) => {
      pcnList.forEach((pcn, pcnIndex) => {
        console.log('pcn : ', pcn.Display_Header, pcnIndex);
        switch (pcn.Display_Header) {
          case 'Status':
            this.onSelect(pcn.Display_Header, pcn.FieldValue, pcnListIndex);
            break;
          case 'Sub_Status':
            this.onSelect(pcn.Display_Header, pcn.FieldValue, pcnListIndex);
            break;
          case 'Action_Code':
            this.onSelect(pcn.Display_Header, pcn.FieldValue, pcnListIndex);
            break;

          default:
            break;
        }
      })
    })

  }

  manageKeyList() {
    const fixedList = [
      "Patient Name",
      "MRN",
      "Patient Account",
      "Admit Date",
      "Payer",
      "Total Charges",
      "Claim Amount",
      "Practice",
      "Last_billed_date",
      "CallReference_No"
    ];
    const keys = Object.keys(this.inventory);
    fixedList.forEach((item) => {
      if (keys.includes(item) == true) {
        this.keyList.push(item)
      }
    });
  }

  setFieldType() {
    this.fixedPCNFields.forEach((pcn) => {

      if (pcn.Display_Header == 'Charge' || pcn.Display_Header == 'Balance' || pcn.Display_Header == 'InventoryId' || pcn.Display_Header == 'Inventory_Log_Id') {
        pcn.FieldType = 'Numeric';
      }
      else if (pcn.Display_Header == 'Status' || pcn.Display_Header == 'Sub_Status' || pcn.Display_Header == 'Action_Code') {
        pcn.FieldType = 'Dropdown';
      }
      else if (pcn.Display_Header == 'DOS') {
        pcn.FieldType = 'Date';
      }
      else {
        pcn.FieldType = 'Textbox';
      }

    });

    this.addPCN();
  }

  createPCN() {
    return this.fb.group({
      pcn: this.fb.array([])
    });
  }

  addPCN() {
    // console.log('addPCN() : ', this.addPCNForm.controls);
    const pcnList = this.addPCNForm.get('pcnList') as FormArray;
    // console.log('pcnList : ', pcnList);
    pcnList.push(this.createPCN());

    const lastPCN = pcnList.controls[pcnList.controls.length - 1];
    const pcnItemList = lastPCN.get('pcn') as FormArray;
    // console.log('Before pcnItemList this.fixedPCNFields : ', this.fixedPCNFields);
    // const lastPCNListIndex = pcnList.controls.length - 1;
    this.fixedPCNFields.forEach((pcn: any, pcnIndex) => {
      if (pcn && pcn.FieldType == 'Dropdown') {
        switch (pcn.Display_Header) {
          case 'Status':
            pcn.list = _.map(this.SaagLookup, 'Status');
            pcn.list = _.uniq(pcn.list);
            break;
          case 'Sub_Status':
            pcn.list = [];
            break;
          case 'Action_Code':
            pcn.list = [];
            break;

          default:
            break;
        }
      }

      pcnItemList.push(this.createPCNItem(pcn));
    });
  }
  createPCNItem(pcn) {
    return this.fb.group({
      "Display_Header": [pcn.Display_Header, Validators.required],
      "Column_Data_Type": [pcn.Column_Data_Type],
      "FieldType": [pcn.FieldType],
      "Field_Limit": [pcn.Field_Limit],
      "FieldValue": [pcn.FieldValue, [Validators.required]],
      list: [pcn.list]
    })
  }
  dateTimeChange(event, controls) {
    console.log('event,controls : ', event, controls);
  }
  BlockInput(event) {
    console.log('BlockInput(event) : ', event);
  }
  changeDropdown() {
    console.log('changeDropdown() : ', this.addPCNForm);
  }

  checkIfAlreadyExist(field, index) {
    console.log('field,index : ', field, index);
  }
  savePCN() {
    // console.log('final submit : ', this.addPCNForm);
    const finalArray = [];
    const { value } = this.addPCNForm;
    this.submitBtnStatus = true;
    if (this.addPCNForm.valid == false) {
      return false;
    }
    this.disableBtn = true;
    // console.log('value : ', value);
    value.pcnList.forEach((ele) => {
      const obj = {}
      ele.pcn.forEach(element => {
        obj[element['Display_Header']] = element['FieldValue']
      });
      // console.log('obj : ', obj);
      finalArray.push(obj);
    });
    finalArray.forEach((pcn) => {
      pcn['PCN_IDs'] = [];
    })
    const body = {
      "Client_Id": this.inventory.Client_Id,
      "_lstFields": finalArray
    };
    console.log('body : ', JSON.stringify(body));
    this.pcnService.savePCN(body).subscribe((response) => {
      this.disableBtn = false;
    }, (error) => {
      this.disableBtn = false;
      this.setResponseIntoLocal({});
    })
    console.log('finalArray : ', finalArray)
  }

  setResponseIntoLocal(response) {
    response = {
      "Message": [
        {
          "Message": "PCN Data Save Successfully",
          "Type": "SUCCESS"
        }
      ],
      "Data": {
        "_pcn_Ids": [
          {
            "Pcn_Id": 5
          },
          {
            "Pcn_Id": 6
          },
          {
            "Pcn_Id": 7
          },
          {
            "Pcn_Id": 8
          }
        ],
        "_high_Priority": {
          "_lstHighPriority": {
            "Balance": "200",
            "DOS": "07/06/2010",
            "Charge": "20",
            "PCN_Number": "A002",
            "Status": "CLAIM PAID",
            "Sub_Status": "PAID NOT POSTED_POST 30DAYS",
            "Action_Code": "CANCELLED CHECK REQUESTED",
            "Effectiveness": "CASH IN BANK",
            "InventoryId": "7",
            "Inventory_Log_Id": "1",
            "PCN_IDs": [
              1,
              2,
              3
            ]
          }
        }
      }
    }
    const finalObj = response.Data._high_Priority._lstHighPriority;
    finalObj.PCN_IDs = finalObj.PCN_IDs && finalObj.PCN_IDs.length > 0 ? finalObj.PCN_IDs : [];
    response.Data._pcn_Ids.forEach((pcn) => {
      finalObj.PCN_IDs.push(pcn.Pcn_Id);
    })
    finalObj.PCN_IDs = _.uniq(finalObj.PCN_IDs);
    console.log('finalObj : ', finalObj);
    sessionStorage.setItem('localPCN', JSON.stringify(finalObj));
    this.close.emit();
  }

  CloseModal() {
    console.log('CloseModal() :');
    this.close.emit();
  }

  onStatusChange() {
    console.log('onStatusChange() : ');
  }

  onSelect(header, value, listIndex) {
    // console.log('control, listIndex, itemIndex : ', control, listIndex, itemIndex)
    const pcnList = this.addPCNForm.get('pcnList') as FormArray;
    const activePCN = pcnList.controls[listIndex];
    const pcnItemList = activePCN.get('pcn') as FormArray;
    // console.log('onSelect : ', pcnList, pcnItemList);
    switch (header) {

      case 'Status': {
        const subStatusList = this.SaagLookup.filter((saag) => {
          if (saag.Status == value) {
            return saag.Sub_Status;
          }
        });
        this.setSubStatus(pcnItemList, subStatusList);
        break;
      }
      case 'Sub_Status': {
        const actionCodeList = this.SaagLookup.filter((saag) => {
          if (saag.Sub_Status == value) {
            return saag.Action_Code;
          }
        });
        this.setActionCode(pcnItemList, actionCodeList);
        break;
      }
    }

    // console.log('subStatusList : ', subStatusList);
  }

  setSubStatus(pcnItemList, subStatusList) {
    // pcnItem.controls.list.value = []
    console.log('setSubStatus : ', pcnItemList, subStatusList);
    pcnItemList.controls.forEach((pcnItem, index) => {
      // console.log('pcnItem.controls.Display_Header.value : ', pcnItem.controls.Display_Header)
      if (pcnItem.controls.Display_Header.value == 'Sub_Status') {
        // pcnItem.controls.list.value = subStatusList;
        const obj = pcnItem.value;
        console.log('obj : ', obj);
        pcnItem.patchValue({ list: _.map(subStatusList, 'Sub_Status') });
        if (subStatusList && subStatusList.length == 1) {
          pcnItem.patchValue({ FieldValue: subStatusList[0].Sub_Status });
        }

        return true;
      }
    })
  }

  onSubStatusChange() {
    console.log('onSubStatusChange() : ');
  }

  setActionCode(pcnItemList, actionCodeList) {
    console.log('setActionCode : ', pcnItemList, actionCodeList);
    pcnItemList.controls.forEach((pcnItem, index) => {
      // console.log('pcnItem.controls.Display_Header.value : ', pcnItem.controls.Display_Header)
      if (pcnItem.controls.Display_Header.value == 'Action_Code') {
        // pcnItem.controls.list.value = subStatusList;
        const obj = pcnItem.value;
        console.log('obj : ', obj);
        pcnItem.patchValue({ list: _.map(actionCodeList, 'Action_Code') });
        if (actionCodeList && actionCodeList.length == 1) {
          pcnItem.patchValue({ FieldValue: actionCodeList[0].Action_Code });
        }
        return true;
      }
    })
  }
}

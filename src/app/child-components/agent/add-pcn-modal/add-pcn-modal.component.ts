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
  PCN_IDs = []
  constructor(private fb: FormBuilder, private pcnService: PcnService, private _clipboardService: ClipboardService, private notification: NotificationService) { }

  ngOnInit() {
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
    var lastPCN = sessionStorage.getItem('lastPCN') ? JSON.parse(sessionStorage.getItem('lastPCN')) : null
    if (lastPCN != null) {
      this.PCN_IDs = lastPCN.PCN_IDs;
    }
    var localPCN: any = sessionStorage.getItem('localPCN');
    localPCN = localPCN ? JSON.parse(localPCN) : null;
    if (localPCN != null) {
      this.pcnInfo = localPCN;
      this.setUpNewPCN();
      return false;
    }
    console.log('localPCN : ', localPCN);
    this.pcnService.getPCNForInventory(Client_Id, Inventory_Id, Inventory_Log_Id).subscribe((response: any) => {
      console.log('response : ', response);
      // this.addNewPCN();
      this.pcnInfo = JSON.parse(JSON.stringify(response.Data));
      this.setUpNewPCN();
    }, (error) => {
      console.log('error : ', error);
      this.ResponseHelper.GetFaliureResponse(error);
      this.addNewPCN();
    });
  }

  setUpNewPCN() {
    console.log('getPCNData : ', this.pcnInfo);
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
    this.fixedPCNFields = JSON.parse(JSON.stringify(this.pcnInfo[0]));
    this.setFieldType();
    // this.fixedPCNFields.forEach((pcn: any) => {
    //   switch (pcn.Display_Header) {
    //     case 'InventoryId':
    //       pcn.FieldValue = this.inventory.Inventory_Id;
    //       break;
    //     case 'Inventory_Log_Id':
    //       pcn.FieldValue = this.inventory.Inventory_Log_Id;
    //       break;
    //     default:
    //       break;
    //   }
    // })
    // this.addPCN();

    setTimeout(() => {
      const pcnList = this.addPCNForm.get('pcnList') as FormArray;
      var elmnt = document.getElementById('pcnList' + (pcnList.length - 1));
      elmnt.scrollIntoView();
    }, 100);
  }

  removePCN(index) {
    const pcnList = this.addPCNForm.get('pcnList') as FormArray;
    pcnList.removeAt(index)
  }
  setDropdownFields() {
    this.pcnInfo.forEach((pcnList, pcnListIndex) => {
      pcnList.forEach((pcn, pcnIndex) => {
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
    const pcnList = this.addPCNForm.get('pcnList') as FormArray;
    pcnList.push(this.createPCN());
    const lastPCN = pcnList.controls[pcnList.controls.length - 1];
    const pcnItemList = lastPCN.get('pcn') as FormArray;
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
    if (pcn.Display_Header == 'InventoryId') {
      pcn.FieldValue = (pcn.FieldValue != null) ? pcn.FieldValue : this.inventory.Inventory_Id;
    }
    if (pcn.Display_Header == 'Inventory_Log_Id') {
      pcn.FieldValue = (pcn.FieldValue != null) ? pcn.FieldValue : this.inventory.Inventory_Log_Id;
    }
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
    if (event.key == 'Backspace' || event.key == 'Tab') {
      return true;
    }
    else {
      return false;
    }
  }
  changeDropdown() {
    console.log('changeDropdown() : ', this.addPCNForm);
  }

  checkIfAlreadyExist(control, listIndex, itemIndex) {
    console.log('control, pcnIndex,pcnItemIndex : ', control, listIndex, itemIndex);
    const pcnList = this.addPCNForm.get('pcnList') as FormArray;
    control.FieldValue.setErrors(null);
    pcnList.controls.forEach((pcn, pcnIndex) => {
      if (listIndex !== pcnIndex) {
        const pcnItemList = pcn.get('pcn') as FormArray;
        pcnItemList.controls.forEach((pcnItem: any, index) => {
          // console.log('pcnItem : ', pcnItem)
          if (control.Display_Header.value == 'PCN_Number' && pcnItem.controls.Display_Header.value == 'PCN_Number') {
            if (control.FieldValue.value == pcnItem.controls.FieldValue.value) {
              control.FieldValue.setErrors({ incorrect: true });
            }
          }
        });
      }
    });
  }
  savePCN() {
    const finalArray = [];
    const value = this.addPCNForm.getRawValue();
    this.submitBtnStatus = true;
    this.makeFieldsDirty();
    if (this.addPCNForm.valid == false) {
      return false;
    }
    this.disableBtn = true;
    const localPCNArray = []
    value.pcnList.forEach((ele) => {
      localPCNArray.push(ele.pcn)
    })
    sessionStorage.setItem('localPCN', JSON.stringify(localPCNArray));
    value.pcnList.forEach((ele) => {
      const obj = {}
      ele.pcn.forEach(element => {
        obj[element['Display_Header']] = element['FieldValue'];
      });
      finalArray.push(obj);
    });
    finalArray.forEach((pcn) => {
      pcn['PCN_IDs'] = (this.PCN_IDs && this.PCN_IDs.length > 0) ? this.PCN_IDs : [];
    });
    const body = {
      "Client_Id": this.inventory.Client_Id,
      "_lstFields": finalArray
    };
    console.log('body : ', JSON.stringify(body));
    this.pcnService.savePCN(body).subscribe((response) => {
      console.log('savePCN : ', response);
      this.disableBtn = false;
      this.setResponseIntoLocal(response);
      this.ResponseHelper.GetSuccessResponse(response);
    }, (error) => {
      console.log('savePCN error : ', error);
      this.disableBtn = false;
      this.ResponseHelper.GetFaliureResponse(error);

    })
    console.log('finalArray : ', finalArray)
  }

  setResponseIntoLocal(response) {
    const finalObj = response.Data._high_Priority._lstHighPriority;
    finalObj.PCN_IDs = finalObj.PCN_IDs && finalObj.PCN_IDs.length > 0 ? finalObj.PCN_IDs : [];
    response.Data._pcn_Ids.forEach((pcn) => {
      finalObj.PCN_IDs.push(pcn.Pcn_Id);
    })
    finalObj.PCN_IDs = _.uniq(finalObj.PCN_IDs);
    console.log('finalObj : ', finalObj);
    sessionStorage.setItem('lastPCN', JSON.stringify(finalObj));
    this.close.emit();
  }

  makeFieldsDirty() {
    const pcnList = this.addPCNForm.get('pcnList') as FormArray;
    console.log('pcnList : ', pcnList)
    pcnList.controls.forEach((list) => {
      const pcnItemList = list.get('pcn') as FormArray;
      console.log('pcnItemList : ', pcnItemList);
      pcnItemList.controls.forEach((pcnItem: any) => {
        console.log('pcnItem : ', pcnItem);
        pcnItem.controls.FieldValue.markAsDirty();
        // pcnItem.markAsDirty();
      })
    })
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
    this.setEffectiveness(pcnItemList);
  }

  setEffectiveness(pcnItemList) {
    // console.log('setEffectiveness : ', pcnItemList.value);
    const obj: any = {};
    pcnItemList.value.forEach((item) => {
      if (item.Display_Header == 'Status' || item.Display_Header == 'Sub_Status' || item.Display_Header == 'Action_Code') {
        obj[item.Display_Header] = item.FieldValue;
      }
    });
    // console.log('setEffectiveness obj : ', obj);
    if (obj.Status != null && obj.Sub_Status != null && obj.Action_Code != null) {

      const matchedObj = _.find(this.SaagLookup, (saag) => {
        // console.log('find loop : ', saag.Status, obj.Status, saag.Sub_Status, obj.Sub_Status, saag.Sub_Status, obj.Action_Code);
        return saag.Status == obj.Status && saag.Sub_Status == obj.Sub_Status && saag.Action_Code == obj.Action_Code;
      });
      console.log('effectiveness : ', matchedObj);
      pcnItemList.controls.forEach((pcnItem, index) => {
        console.log('pcnItemList forEach : ', pcnItem);
        if (pcnItem.controls.Display_Header.value == 'Effectiveness') {
          pcnItem.disable();
          if (matchedObj && matchedObj.Effectiveness_Matrix) {
            pcnItem.patchValue({ FieldValue: matchedObj.Effectiveness_Matrix });
          }
          else {
            pcnItem.patchValue({ FieldValue: null });
          }
        }
      });
    }
  }

  setSubStatus(pcnItemList, subStatusList) {
    pcnItemList.controls.forEach((pcnItem, index) => {
      if (pcnItem.controls.Display_Header.value == 'Sub_Status') {
        pcnItem.patchValue({ list: _.map(subStatusList, 'Sub_Status') });
        if (subStatusList && subStatusList.length == 1) {
          pcnItem.patchValue({ FieldValue: subStatusList[0].Sub_Status });
        }
        return true;
      }
    })
  }

  setActionCode(pcnItemList, actionCodeList) {
    pcnItemList.controls.forEach((pcnItem, index) => {
      if (pcnItem.controls.Display_Header.value == 'Action_Code') {
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

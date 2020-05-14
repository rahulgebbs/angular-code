import { Component, OnInit, OnChanges, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';

import * as _ from 'lodash'
import { PcnService } from 'src/app/service/pcn.service';


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
  // statusList = [];
  // subStatusList = [];
  // actionCodeList = [];
  fixedPCNFields = [

    {
      "Display_Header": "PCN_Number",
      "Column_Data_Type": "Text",
      "FieldType": "Textbox",
      "FieldValue": "",
      "Field_Limit": 0
    },
    {
      "Display_Header": "Status",
      "Column_Data_Type": "Text",
      "FieldType": "Dropdown",
      "FieldValue": "",
      "Field_Limit": 0
    },
    {
      "Display_Header": "Sub_Status",
      "Column_Data_Type": "Text",
      "FieldType": "Dropdown",
      "FieldValue": "",
      "Field_Limit": 0
    },
    {
      "Display_Header": "Action_Code",
      "Column_Data_Type": "Text",
      "FieldType": "Dropdown",
      "FieldValue": "",
      "Field_Limit": 0
    },
    {

      "Display_Header": "Effectiveness",
      "Column_Data_Type": "Text",
      "FieldType": "Textbox",
      "FieldValue": "",
      "Field_Limit": 0
    },
    {

      "Display_Header": "InventoryId",
      "Column_Data_Type": "Numeric",
      "FieldType": "Numeric",
      "FieldValue": 0,
      "Field_Limit": 0
    },
    {
      "Display_Header": "Inventory_Log_Id",
      "Column_Data_Type": "Numeric",
      "FieldType": "Numeric",
      "FieldValue": 0,
      "Field_Limit": 0
    },
    {
      "Display_Header": "Charge",
      "Column_Data_Type": "Numeric",
      "FieldType": "Numeric",
      "FieldValue": 0,
      "Field_Limit": 0
    },
    {
      "Display_Header": "Balance",
      "Column_Data_Type": "Numeric",
      "FieldType": "Numeric",
      "FieldValue": 0,
      "Field_Limit": 0
    },
    {
      "Display_Header": "DOS",
      "Column_Data_Type": "Date",
      "FieldType": "Date",
      "FieldValue": new Date().toISOString(),
      "Field_Limit": 0
    }
  ]
  constructor(private fb: FormBuilder, private pcnService: PcnService) { }

  ngOnInit() {
    this.addPCNForm = this.fb.group({
      pcnList: this.fb.array([])
    });
    this.addPCN();
  }

  ngOnChanges(changes) {
    console.log('changes : ', changes);
    this.manageKeyList();

    // this.manageDropDownList();
  }

  manageDropDownList() {
    // this.statusList = _.map(this.SaagLookup, 'Status');
    // this.statusList = _.uniq(this.statusList);
    // this.actionCodeList = _.map(this.SaagLookup, 'Action_Code');
    // this.actionCodeList = _.uniq(this.actionCodeList);
    // this.subStatusList = _.map(this.SaagLookup, 'Sub_Status');
    // this.subStatusList = _.uniq(this.subStatusList);
    // console.log('manageDropDownList : ', this.statusList, this.subStatusList, this.actionCodeList);
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

  createPCN() {
    return this.fb.group({
      pcn: this.fb.array([])
    });
  }

  addPCN() {
    console.log('addPCN() : ', this.addPCNForm.controls);
    const pcnList = this.addPCNForm.get('pcnList') as FormArray;
    console.log('pcnList : ', pcnList);
    pcnList.push(this.createPCN());

    const lastPCN = pcnList.controls[pcnList.controls.length - 1];
    const pcnItemList = lastPCN.get('pcn') as FormArray;
    console.log('pcnItemList : ', pcnItemList);
    this.fixedPCNFields.forEach((pcn: any) => {
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
    const body = {
      "Client_Id": this.inventory.Client_Id,
      "_lstFields": finalArray
    };
    console.log('body : ', JSON.stringify(body));
    this.pcnService.savePCN(body).subscribe((response) => {
      this.disableBtn = false;
    }, (error) => {
      this.disableBtn = false;
    })
    console.log('finalArray : ', finalArray)
  }

  CloseModal() {
    console.log('CloseModal() :');
    this.close.emit();
  }

  onStatusChange() {
    console.log('onStatusChange() : ');
  }

  onSelect(control, listIndex, itemIndex) {
    // console.log('control, listIndex, itemIndex : ', control, listIndex, itemIndex)
    const pcnList = this.addPCNForm.get('pcnList') as FormArray;
    const activePCN = pcnList.controls[listIndex];
    const pcnItemList = activePCN.get('pcn') as FormArray;
    // console.log('onSelect : ', pcnList, pcnItemList);
    switch (control.Display_Header.value) {

      case 'Status': {
        const subStatusList = this.SaagLookup.filter((saag) => {
          if (saag.Status == control.FieldValue.value) {
            return saag.Sub_Status;
          }
        });
        this.setSubStatus(pcnItemList, subStatusList);
        break;
      }

      case 'Sub_Status': {
        const actionCodeList = this.SaagLookup.filter((saag) => {
          if (saag.Sub_Status == control.FieldValue.value) {
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
    console.log('setSubStatus : ', pcnItemList, actionCodeList);
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

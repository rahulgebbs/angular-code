import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-pcn-modal',
  templateUrl: './add-pcn-modal.component.html',
  styleUrls: ['./add-pcn-modal.component.scss']
})
export class AddPcnModalComponent implements OnInit {
  addPCNForm: FormGroup
  // @Output() close = new EventEmitter();
  // @Output() save = new EventEmitter();
  pcnList: any;
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
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.addPCNForm = this.fb.group({
      pcnList: this.fb.array([])
    });
    this.addPCN();
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
    const pcnItemList = lastPCN.get('pcn') as FormArray
    console.log('pcnItemList : ', pcnItemList);
    this.fixedPCNFields.forEach((pcn) => {
      pcnItemList.push(this.createPCNItem(pcn));
    });
  }
  createPCNItem(pcn) {
    return this.fb.group({
      "Display_Header": [pcn.Display_Header, Validators.required],
      "Column_Data_Type": [pcn.Column_Data_Type, Validators.required],
      "FieldType": [pcn.FieldType, Validators.required],
      "Field_Limit": [pcn.Field_Limit, [Validators.required, Validators.pattern(/^(\d|,)*\d*$/)]],
      "FieldValue": [pcn.FieldValue, [Validators.required, Validators.pattern(/^(\d|,)*\d*$/)]]
    })
  }

  // createItem(pcn): FormGroup {
  //   console.log('addPCNForm : ', this.addPCNForm);
  //   return this.fb.group({
  //     "Display_Header": [pcn.Display_Header, Validators.required],
  //     "Column_Data_Type": [pcn.Column_Data_Type, Validators.required],
  //     "Field_Limit": [pcn.Field_Limit, [Validators.required, Validators.pattern(/^(\d|,)*\d*$/)]]
  //   }
  //   );
  // }

  // addItem(): void {
  //   this.pcnList = this.addPCNForm.get('pcnList') as FormArray;
  // this.pcnList.push(this.createItem());
  // }
}

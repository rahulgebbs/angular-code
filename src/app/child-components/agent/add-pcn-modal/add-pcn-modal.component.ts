import { Component, OnInit, OnChanges, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-pcn-modal',
  templateUrl: './add-pcn-modal.component.html',
  styleUrls: ['./add-pcn-modal.component.scss']
})
export class AddPcnModalComponent implements OnInit, OnChanges {
  addPCNForm: FormGroup;
  @Input() inventory;
  @Output() close = new EventEmitter();
  // @Output() save = new EventEmitter();
  pcnList: any;
  keyList = [];
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

  ngOnChanges(changes) {
    // this.keyList = ["Patient Name",
    //   "MRN",
    //   "Patient Account",
    //   "Admit Date",
    //   "Payer",
    //   "Total Charges",
    //   "Claim Amount",
    //   "Practice",
    //   "Last_billed_date",
    //   "CallReference_No"];
    // console.log('this.inventory : ', this.inventory);
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
      "Column_Data_Type": [pcn.Column_Data_Type],
      "FieldType": [pcn.FieldType],
      "Field_Limit": [pcn.Field_Limit],
      "FieldValue": [pcn.FieldValue, [Validators.required]]
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
  savPCN() {
    // console.log('final submit : ', this.addPCNForm);
    const finalArray = [];
    const { value } = this.addPCNForm;
    // console.log('value : ', value);
    value.pcnList.forEach((ele) => {
      const obj = {}
      ele.pcn.forEach(element => {
        obj[element['Display_Header']] = element['FieldValue']
      });
      // console.log('obj : ', obj);
      finalArray.push(obj)
    })
    console.log('finalArray : ', finalArray)
  }

  CloseModal() {
    console.log('CloseModal() :');
    this.close.emit();
  }
}

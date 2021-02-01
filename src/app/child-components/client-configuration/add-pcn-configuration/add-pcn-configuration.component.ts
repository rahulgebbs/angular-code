import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';


@Component({
  selector: 'app-add-pcn-configuration',
  templateUrl: './add-pcn-configuration.component.html',
  styleUrls: ['./add-pcn-configuration.component.scss']
})
export class AddPcnConfigurationComponent implements OnInit {
  addPCNForm: FormGroup
  @Output() close = new EventEmitter();
  @Output() save = new EventEmitter();
  constructor(private fb: FormBuilder) { }
  pcnList: any;
  disableBtn = false;
  submitStatus = false;
  ngOnInit() {
    this.addPCNForm = this.fb.group({
      "Display_Header": ['', Validators.required],
      "Column_Data_Type": ['', Validators.required],
      "Field_Limit": ['', [Validators.required, Validators.pattern(/^(\d|,)*\d*$/)]]
    })
    // this.addItem();
  }
  createItem() {
    // console.log('addPCNForm : ', this.addPCNForm);
    // return this.fb.group({
    //   "Display_Header": ['', Validators.required],
    //   "Column_Data_Type": ['', Validators.required],
    //   "Field_Limit": ['', [Validators.required, Validators.pattern(/^(\d|,)*\d*$/)]]
    // });
  }
  addItem(): void {
    // this.pcnList = this.addPCNForm.get('pcnList') as FormArray;
    // this.pcnList.push(this.createItem());
  }

  checkIfAlreadyExist(field, fieldIndex) {
    // const pcnList = this.addPCNForm.value.pcnList;
    // var matchedElement;
    // matchedElement = pcnList.find((element, index) => {
    //   if (field.value.length > 0 && fieldIndex != index) {
    //     return field.value == element.Display_Header;
    //   }
    // });
    // if (matchedElement != null) {
    //   console.log('matchedElement : ', matchedElement)
    //   field.setErrors({ 'incorrect': true });
    // }
    // else {
    //   if (field.value.length > 0)
    //     field.setErrors(null);
    // }
  }

  removeItem(index) {
    this.pcnList.removeAt(index);
  }

  CloseModal() {
    this.close.emit(false);
  }

  checkField(field) {
    // console.log('checkField(field) : ', field)
  }

  saveFields() {
    console.log('saveFields() : ', this.addPCNForm.value);
    this.submitStatus = true;
    if (this.addPCNForm && this.addPCNForm.valid == true) {
      this.save.emit(this.addPCNForm.value);
    }
  }
}

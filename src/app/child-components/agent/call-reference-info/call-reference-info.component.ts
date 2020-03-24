import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'app-call-reference-info',
  templateUrl: './call-reference-info.component.html',
  styleUrls: ['./call-reference-info.component.scss']
})
export class CallReferenceInfoComponent implements OnInit {
  @Output() close = new EventEmitter()
  constructor() { }
  firstName = "<<First Name>>";
  providerName = "<<Provider Name>>";
  taxID = "<<Tax ID>>";
  contactNumber = "<<Contact Number>>";
  extension = "<<Extension>>";
  referenceNumber = "<<Reference Number>>"
  ngOnInit() {
  }

  closeModal() {
    console.log('closeModal() : ');
    try {
      this.close.emit();
    } catch (error) {
      console.log('try catch : ', error)
    }
  }
}

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
// import { EventEmitter } from 'protractor';

@Component({
  selector: 'app-client-instruction-info',
  templateUrl: './client-instruction-info.component.html',
  styleUrls: ['./client-instruction-info.component.scss']
})
export class ClientInstructionInfoComponent implements OnInit {
  @Output() close = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  closeModal() {
    this.close.emit(false);
  }

}

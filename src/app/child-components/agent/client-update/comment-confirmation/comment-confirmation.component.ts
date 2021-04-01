import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
// import { } from 'events';

@Component({
  selector: 'app-comment-confirmation',
  templateUrl: './comment-confirmation.component.html',
  styleUrls: ['./comment-confirmation.component.css']
})
export class CommentConfirmationComponent implements OnInit {
  @Output() close = new EventEmitter<any>();
  @Input() activeRow;
  constructor() { }

  ngOnInit() {
    console.log('ngOnInit : ', this.activeRow);
  }

  accept() {
    this.closeModal();
  }

  closeModal() {
    console.log('app-comment-confirmation closeModal() : ')
    this.close.emit();
  }
}

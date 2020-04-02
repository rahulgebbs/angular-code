import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-concluder-report',
  templateUrl: './concluder-report.component.html',
  styleUrls: ['./concluder-report.component.scss']
})
export class ConcluderReportComponent implements OnInit {
  fromDate = new Date();
  maxDate = new Date();
  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }

}

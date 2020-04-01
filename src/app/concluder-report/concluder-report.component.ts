import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-concluder-report',
  templateUrl: './concluder-report.component.html',
  styleUrls: ['./concluder-report.component.css']
})
export class ConcluderReportComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }

}

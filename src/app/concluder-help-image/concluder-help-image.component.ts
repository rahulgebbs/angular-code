import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
// import { EventEmitter } from 'events';
declare var Highcharts: any;

@Component({
  selector: 'app-concluder-help-image',
  templateUrl: './concluder-help-image.component.html',
  styleUrls: ['./concluder-help-image.component.css']
})
export class ConcluderHelpImageComponent implements OnInit {
  @Input() name: string;
  @Output() close = new EventEmitter();

  constructor() { }


  ngOnInit() {

    // Highcharts.chart("container", {
    //   chart: {
    //     type: "timeline"
    //   },


    //   xAxis: {
    //     //type: 'datetime',
    //     visible: false
    //   },


    //   yAxis: {
    //     visible: false
    //   },


    //   title: {
    //     text: null
    //   },
    //   plotOptions: {
    //     series: {
    //       color: 'purple'
    //     }
    //   },
    //   series: [
    //     {
    //       dataLabels: {
    //         connectorColor: "silver",
    //         alternate: false,
    //         distance: -75
    //       },
    //       marker: {
    //         symbol: 'circle',
    //         height: 20,
    //         width: 20
    //       },
    //       useHTML: true,
    //       data: [
    //         {
    //           x: 3220,
    //           name: "3220",
    //           label: "Smallest",
    //           description: "The smallest number in th row.",
    //           color: "#26c281", // green
    //           onArea: true
    //         },
    //         {
    //           x: 4026.25,
    //           name: "4026.25",
    //           label: "First Half",
    //           description: "The average of smallest and middle number",
    //           color: "#FFC200", //amber
    //           onArea: false
    //         },
    //         {
    //           x: 4832.5,
    //           name: "4832.5",
    //           label: "Middle",
    //           description:
    //             "The average of smallest and largest number",
    //           color: "#FFC200", // amber
    //           onArea: false
    //         },
    //         {
    //           x: 5638.75,
    //           name: "5638.75",
    //           label: "Second Half",
    //           description:
    //             "The average of middle and largest number",
    //           color: "#FFC200", //amber
    //           onArea: false
    //         },
    //         {
    //           x: 6445,
    //           name: "6445",
    //           label: "Largest",
    //           description:
    //             "The largest number in the row.",
    //           color: "#f03434", //red
    //           onArea: false
    //         }
    //       ]
    //     }
    //   ]
    // });
  }

  CloseModal() {
    this.close.emit(true);
  }


}

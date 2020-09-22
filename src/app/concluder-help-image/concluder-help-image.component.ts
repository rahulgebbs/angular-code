import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
// import { EventEmitter } from 'events';
declare var Highcharts: any;
import * as _ from 'lodash';
@Component({
  selector: 'app-concluder-help-image',
  templateUrl: './concluder-help-image.component.html',
  styleUrls: ['./concluder-help-image.component.css']
})
export class ConcluderHelpImageComponent implements OnInit {
  @Input() name: string;
  @Output() close = new EventEmitter();
  @Input() allData;
  seriesData = [];
  activeBucket = 'Total $$';
  mainChart: any;
  bucketList = [];
  constructor() { }


  ngOnInit() {
    console.log('allData : ', this.allData);
    this.bucketList = _.map(this.allData, 'Buckets');
    console.log('this.bucketList : ', this.bucketList)
    this.setRAGValues();
  }

  CloseModal() {
    this.close.emit(true);
  }

  setRAGValues() {
    console.log('setRAGValues() : ', this.allData);
    let mainArray = [];
    var keyList = ["To_Be_Concluded",
      "Rejections",
      "Paid_EOB_Availble",
      "Paid_NO_EOB",
      "Denials_Provider_Issue",
      "Denials_Payer_Issue",
      "Denials_Patient_Issue",
      "Denials_Coding_Issue",
      "No_Response_Website",
      "No_Response_IVR",
      "No_Response_Fax",
      "No_Response_Calling"];

    this.allData.forEach((row) => {
      // console.log('row : ', row);
      // if (row.Buckets == '%%%_##' || row.Buckets == '%%_$$') {
      //   this.setPercentage(row, keyList)
      //   return false;
      // }
      mainArray = [];
      keyList.forEach((key) => {
        console.log(`row[${key}] : `, row[key], key);
        if (key != "To_Be_Concluded" && row[key] != null && row[key] != undefined && row[key] > 0) {
          mainArray.push({ 'value': Number(row[key]), 'key': key })
        }
      })
      // console.log('mainArray : ', mainArray);
      if (mainArray != undefined && mainArray.length > 0) {
        this.calculate(row, mainArray)
      }
      // else if (row.Buckets == '%%%_##' || row.Buckets == '%%_$$') {
      //   // mainArray.push({ 'value': Number(row[key]), 'key': key })
      //   this.setPercentage(row, mainArray)
      //   // return false;
      // }
    });
  }

  calculate(row, array) {
    const finalArray = [];
    var maxNum = _.maxBy(array, 'value');
    var minNum = _.minBy(array, 'value');

    finalArray.push({ key: maxNum.key, color: "#f03434" }); //red
    if (minNum.value > 0) {
      finalArray.push({ key: minNum.key, color: "#26c281" }); // green
    }
    var mainHalf = (maxNum.value + minNum.value) / 2;
    var firstHalf = (minNum.value + mainHalf) / 2;
    var secondHalf = (maxNum.value + mainHalf) / 2;
    console.log('calc now : ', array);
    console.log('calc now firstHalf, secondHalf, maxNum, minNum, mainHalf: ', firstHalf, secondHalf, maxNum, minNum, mainHalf);

    // // set smallest
    // this.setSeriesData({
    //   x: minNum.value,
    //   name: `${minNum.value}`,
    //   label: "Smallest",
    //   description: "The smallest number in th row.",
    //   color: "#26c281", // green
    //   onArea: true,
    //   Buckets: row.Buckets
    // })
    // // set first half
    // this.setSeriesData({
    //   x: firstHalf,
    //   name: `${firstHalf}`,
    //   label: "First Half",
    //   description: "The average of smallest and middle number",
    //   color: "#FFC200", //amber
    //   onArea: false,
    //   Buckets: row.Buckets
    // });
    // // set middle
    // this.setSeriesData({
    //   x: mainHalf,
    //   name: `${mainHalf}`,
    //   label: "Middle",
    //   description:
    //     "The average of smallest and largest number",
    //   color: "#FFC200", // amber
    //   onArea: false,
    //   Buckets: row.Buckets
    // });
    // // set seocnd half
    // this.setSeriesData({
    //   x: secondHalf,
    //   name: `${secondHalf}`,
    //   label: "Second Half",
    //   description:
    //     "The average of middle and largest number",
    //   color: "#FFC200", //amber
    //   onArea: false,
    //   Buckets: row.Buckets
    // });
    // // set largest
    // this.setSeriesData({
    //   x: maxNum.value,
    //   name: `${maxNum.value}`,
    //   label: "Largest",
    //   description:
    //     "The largest number in the row.",
    //   color: "#f03434", //red
    //   onArea: false,
    //   Buckets: row.Buckets
    // });
    // array.forEach((ele) => {
    //   switch (true) {
    //     case (ele.value >= minNum.value) && ele.value <= mainHalf: {
    //       console.log('less than middle : ', row.Buckets, firstHalf);
    //       if (ele.value > firstHalf) {
    //         finalArray.push({ key: ele.key, color: "#FFC200", value: ele.value }); // amber
    //       } else if (ele.value > 0) {
    //         finalArray.push({ key: ele.key, color: "#26c281", value: ele.value }); // green
    //       }
    //       else {
    //         //finalArray.push({ key: ele.key, color: "#2ecc71" }); //green
    //       }
    //       break;
    //     }
    //     case ele.value >= mainHalf && ele.value <= maxNum.value: {
    //       // var secondHalf; //= Math.ceil((maxNum.value + mainHalf) / 2);
    //       // secondHalf = this.sumBetweenTwoNumbers(mainHalf, maxNum.value, array);

    //       if (ele.value > secondHalf) {
    //         finalArray.push({ key: ele.key, color: "#f03434", value: ele.value }); // red
    //       } else {
    //         finalArray.push({ key: ele.key, color: "#FFC200", value: ele.value }); // amber
    //       }
    //       break;
    //     }
    //   }
    // });
    // // console.log('finalArray : ', finalArray);
    // row.report = {};
    // finalArray.forEach((ele) => {
    //   row.report[ele.key] = ele.color;
    // });
    this.initChart()
    // console.log('chartArray : ', this.seriesData);
  }


  setSeriesData(data) {
    this.seriesData.push(data);
    // this.initChart();
    // {
    //   x: 3220,
    //     name: "3220",
    //       label: "Smallest",
    //         description: "The smallest number in th row.",
    //           color: "#26c281", // green
    //             onArea: true
    // }
  }


  initChart() {
    const filterList = this.seriesData.filter((row) => {
      return row.Buckets == this.activeBucket
    });
    if (this.mainChart) {
      this.mainChart.series[0].setData([]);
    }
    console.log('this.mainChart : ', this.activeBucket, filterList)
    this.mainChart = Highcharts.chart("container", {
      chart: {
        type: "timeline"
      },
      xAxis: {
        //type: 'datetime',
        visible: false
      },


      yAxis: {
        visible: false
      },


      title: {
        text: null
      },
      plotOptions: {
        series: {
          color: 'purple'
        }
      },
      series: [
        {
          dataLabels: {
            connectorColor: "silver",
            alternate: false,
            distance: -75
          },
          marker: {
            symbol: 'circle',
            height: 20,
            width: 20
          },
          useHTML: true,
          data: filterList
        }
      ]
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/service/notification.service';
import { Notification } from 'src/app/manager/notification';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  Notifications: Notification[] = new Array<Notification>();
  constructor(private notificationservice: NotificationService, private route: Router) { }

  ngOnInit() {
    this.notification()
  }

  notification() {
    let time = 3000;
    this.notificationservice.notify.subscribe((res: any) => {
      console.log('Before toast res : ', res.length);
      if (res && res.length == 0) {
        return null;
      }
      console.log('After toast res : ', res.length);
      if (Array.isArray(res)) {
        if (res.length > 0) {
          if (res[0] && res[0].time) {
            time = res[0].time ? res[0].time : 3000;
          }
          res.forEach(e => {
            this.Notifications.unshift(e);
          });
        }
        setTimeout(() => {
          for (let i = 0; i < res.length; i++) {
            setTimeout(() => {
              this.Notifications.pop();
              if (res[i].Message == "Access Token is invalid, or has been expired.") {
                this.logOut()
              } else if (res[i].Message == "You are not authorized.") {
                //this.logOut()
              } else if (res[i].Message == 'Please change your Password to visit this page') {
              }
            }, i * 3000);
          }
        }, 1 * time);
      }
      else {
        let err = [];
        err.unshift(res)
        this.Notifications = (err)
        setTimeout(() => {
          this.Notifications = [];
        }, 1 * 3000);
      }
    })
  }
  logOut() {
    this.route.navigate(['/login']);
  }
}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProjectandpriorityService } from 'src/app/service/projectandpriority.service';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
@Component({
  selector: 'app-deactivate-project',
  templateUrl: './deactivate-project.component.html',
  styleUrls: ['./deactivate-project.component.scss']
})
export class DeactivateProjectComponent implements OnInit {
  Deactivate_Reason;
  @Input() client;
  @Input() project;
  @Output() close = new EventEmitter();
  httpStatus = false;
  ResponseHelper: any;
  constructor(private projectandpriorityService: ProjectandpriorityService, private notificationservice: NotificationService) {
    this.ResponseHelper = new ResponseHelper(this.notificationservice);
  }

  ngOnInit() {
    console.log('client : ', this.client, this.project);
  }
  deActivateProject() {
    console.log('deActivateProject :', this.Deactivate_Reason);
    const { Id, Client_Name } = this.client;
    this.projectandpriorityService.deActivateProject({
      "Id": this.project.Id,
      "Client_Id": this.client.Id,
      "Status": "False",
      "Deactivate_Reason": this.Deactivate_Reason
    }).subscribe((response) => {
      console.log('response : ', response);
      this.closeModal();
    }, (error) => {
      console.log('error : ', error);
      this.closeModal();
      this.ResponseHelper.GetFaliureResponse(error);
    })
    // deActivateProject(formObj)

  }

  closeModal() {
    this.close.emit(true);
  }
}

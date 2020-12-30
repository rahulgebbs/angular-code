import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ProjectandpriorityService } from 'src/app/service/projectandpriority.service';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-project-deactivate-confirmation',
  templateUrl: './project-deactivate-confirmation.component.html',
  styleUrls: ['./project-deactivate-confirmation.component.css']
})
export class ProjectDeactivateConfirmationComponent implements OnInit {
  @Output() closeModal = new EventEmitter<any>();
  @Input() Client_Id;
  @Input() projectName;
  ResponseHelper: ResponseHelper;
  constructor(private projectandpriorityService: ProjectandpriorityService, private notificationService: NotificationService) {
    this.ResponseHelper = new ResponseHelper(this.notificationService);
  }

  ngOnInit() {
    console.log('ngOnInit() : ', this.Client_Id, this.projectName);
  }
  close(status) {
    this.closeModal.emit(status);
  }

  deActivateProject() {

    this.projectandpriorityService.deactivateProjectByName(this.Client_Id, this.projectName).subscribe((response) => {
      console.log('deactivateProjectByName : ', response)
      this.ResponseHelper.GetSuccessResponse(response)
      this.close(true);
    }, (error) => {
      console.log('deactivateProjectByName : ', error)
      this.ResponseHelper.GetFaliureResponse(error);
    })
  }
}

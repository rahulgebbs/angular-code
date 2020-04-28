import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { NotificationService } from 'src/app/service/notification.service';
import { ClientUserApprovalService } from 'src/app/service/client-user-approval.service';
import { UserManagementService } from 'src/app/service/user-management.service';
import { finalize } from 'rxjs/operators';
import * as moment from 'moment';
@Component({
  selector: 'app-client-user-approval-modal',
  templateUrl: './client-user-approval-modal.component.html',
  styleUrls: ['./client-user-approval-modal.component.css']
})
export class ClientUserApprovalModalComponent implements OnInit {
  @Input() Client_Id;
  @Input() HeaderStatus;
  @Input() InventoryCount;
  @Input() Inventories;
  @Input() TLAction;
  @Input() Standard_Comment;
  @Output() ClosePopup = new EventEmitter<any>();



  File;
  FileName;
  FileBase64 = '';
  AllChecked = false;
  DisableSubmit = true;
  ResponseHelper: ResponseHelper;
  Start_Time = null;
  ActionList = [
    // { Key: "Pending", Value: "To Internal" },
    { Key: "To Gebbs", Value: "To Gebbs" },
    { Key: "Hold", Value: "Hold" },

    { Key: "Close", Value: "Close" },
    // { Key: "To Internal", Value: "To Internal" }
  ]

  HideList = ["Id", "Inventory_Id", "Status", "Sub-Status", "Action_Code", "Effectiveness", "Action", "Reference_File_Name", "Standard_Comments", "Comments", "Repeat_Count"];
  CommentHistory = [];
  UsersList = [];
  DisableDownload = false;
  ToggleCommentHistory = false;

  constructor(private notification: NotificationService, private service: ClientUserApprovalService, private userservice: UserManagementService) { }

  ngOnInit() {
    this.ResponseHelper = new ResponseHelper(this.notification)
    this.Start_Time = moment().utcOffset(0, true).format();
    this.Inventories.forEach(e => {

      var Inventory_Log_Id = 0;
      var Status = '';
      var Sub_Status = ''
      var Action_Code = ''
      var Effectiveness = '';
      var comments = '';
      var inventory_Id = 0;
      var refFileName = '';
      var repeat_count = 0;
      e.forEach(inven => {
        switch (inven.Header_Name) {

          case 'Id':
            Inventory_Log_Id = inven.Field_Value;
            break;
          case 'Status':
            Status = inven.Field_Value;
            break;
          case 'Sub-Status':
            Sub_Status = inven.Field_Value;
            break;
          case 'Action_Code':
            Action_Code = inven.Field_Value;
            break;
          case 'Effectiveness':
            Effectiveness = inven.Field_Value;
            break;
          case 'Inventory_Id':
            inventory_Id = inven.Field_Value;
            break;
          case 'Comments':
            comments = inven.Field_Value;
            break;
          case 'Reference_File_Name':
            refFileName = inven.Field_Value;
            break;
          case 'Repeat_Count':
            repeat_count = Number(inven.Field_Value);
            break;
          case 'Action':
            break;
        }
      });
      e.Status = Status;
      e.Sub_Status = Sub_Status;
      e.Action_Code = Action_Code;
      e.Effectiveness = Effectiveness;
      e.Inventory_Log_Id = Inventory_Log_Id;
      e.IsChecked = false;
      e.Inventory_Id = inventory_Id;
      e.Repeat_Count = repeat_count;

      if (this.TLAction == 'Hold' || this.TLAction == 'To Internal') {
        e.FileName = '';
      }
      else {
        if (refFileName != '') {
          e.FileName = refFileName;
        } else {
          e.FileName = 'No File Uploaded';
        }
        // }
      }

      if (this.TLAction != 'Hold' && this.TLAction != 'To Internal') {
        e.Action = this.TLAction;
        this.ActionList.forEach(er => {
          if (er.Value == e.Action) {
            e.Action = er.Key;
          }
        });

        e.Comments = comments;

      }
      else {
        e.Action = '';
        e.Comments = '';
      }
    });
    this.GetUsersList();
  }

  GetUsersList() {
    this.userservice.GetClientUsers(this.Client_Id).subscribe(
      res => {
        this.UsersList = res.json().Data;
      },
      err => {
        this.ResponseHelper.GetFaliureResponse(err);
      }
    )
  }

  OnGridReady() {

  }

  ToggleCheckAll(event) {
    if (event.currentTarget.checked) {
      this.Inventories.forEach(e => {
        e.IsChecked = true;
      });
      this.DisableSubmit = false;
    }
    else {
      this.Inventories.forEach(e => {
        e.IsChecked = false;
      });
      this.DisableSubmit = true;
    }
  }

  OnInventoryCheckboxChange(i) {
    if (this.Inventories.every(v => v.IsChecked == true)) {
      this.AllChecked = true;
    }
    else {
      this.AllChecked = false;
    }
    this.DisableSubmit = true;
    if (this.Inventories.some(x => x.IsChecked == true)) {
      this.DisableSubmit = false;
    }
    // this.CheckIfNoAction();
  }

  ViewHistory(i) {
    this.Inventories[i].Inventory_Id;
    this.service.ViewCommentHistory(this.Client_Id, this.Inventories[i].Inventory_Id).subscribe(
      res => {
        this.CommentHistory = res.json().Data;
        this.ToggleCommentHistoryPopup();
      },
      err => {
        this.ResponseHelper.GetFaliureResponse(err);
      }
    )
  }
  ToggleCommentHistoryPopup() {
    this.ToggleCommentHistory = !this.ToggleCommentHistory;
  }

  GetReferenceFile(filename) {
    this.DisableDownload = true;
    this.service.GetReferenceFile(filename).pipe(finalize(() => {
      this.DisableDownload = false;
    })).subscribe(
      (res: any) => {
        var url = window.URL.createObjectURL(res.data);
        var a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      },
      err => {
        this.ResponseHelper.GetFaliureResponse(err);
      }
    )
  }

  OnFileChange(event, i) {
    if (event.target.files && event.target.files.length > 0) {
      this.File = event.target.files[0];
      this.FileName = this.File.name;
      this.Inventories[i].FileName = this.FileName;
      this.ConvertToBase64(i);
    }
    else {
      this.Inventories[i].FileName = '';
      this.File = null;
      this.FileBase64 = '';
    }
  }

  ConvertToBase64(i) {
    let reader = new FileReader();
    reader.readAsDataURL(this.File);
    reader.onload = () => {
      this.FileBase64 = reader.result.toString().split(',')[1];
      this.Inventories[i].File = this.FileBase64;
    };

  }

  Submit() {
    var Invalid = false;
    this.Inventories.forEach(e => {
      if (e.IsChecked) {
        if (e.Action == '' || e.Standard_Comments == '') {
          Invalid = true;
        }
      }
    });

    if (!Invalid) {
      var response = [];
      this.Inventories.forEach(e => {
        if (e.IsChecked === true) {
          response.push(
            {
              Client_Id: this.Client_Id,
              Inventory_Log_Id: e.Inventory_Log_Id,
              Action: e.Action,
              Standard_Comments: this.Standard_Comment,
              Comments: e.Comments,
              File: e.File ? e.File : '',
              FileName: e.FileName,
              Assigned_To_Client_User: e.Client_User,
              Start_Time: this.Start_Time
              // Status: e.Status,
              // Sub_Status: e.Sub_Status,
              // Action_Code: e.Action_Code
            }
          )
        }
      });
      var obj = new Object();
      obj['request_info'] = response;
      this.DisableSubmit = true;
      this.service.SaveInventories(obj).pipe(finalize(() => {
        this.DisableSubmit = false;
      })).subscribe(
        res => {
          this.ResponseHelper.GetSuccessResponse(res);
          this.ClosePopup.emit(true);
        },
        err => {
          this.ResponseHelper.GetFaliureResponse(err);
        }
      );
    }
  }

  Close() {
    this.ClosePopup.emit(false);
  }

}

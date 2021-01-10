import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { ResponseHelper } from 'src/app/manager/response.helper';
import { Token } from 'src/app/manager/token';
import { NotificationService } from 'src/app/service/notification.service';
import { AgentService } from 'src/app/service/agent.service';
import { finalize, debounceTime, distinctUntilChanged, tap, switchMap, catchError, last, retry } from 'rxjs/operators';
import { SaagService } from 'src/app/service/client-configuration/saag.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GlobalInsuranceService } from 'src/app/service/global-insurance.service';
import { DropdownService } from 'src/app/service/client-configuration/dropdown.service';
import { of, Observable } from 'rxjs';
// import { LogoutService } from 'src/app/service/logout.service';
import { CommonService } from 'src/app/service/common-service';
import { dropDownFields } from 'src/app/manager/dropdown-feilds';
import { DenialCodeService } from './../../service/denial-code.service';
import { AnalyticsService } from 'src/app/analytics.service';
import * as moment from 'moment'

import * as $ from 'jquery'

import * as _ from 'lodash';
import { ClientService } from 'src/app/service/client-configuration/client.service';
import { ConcluderService } from 'src/app/service/concluder.service';
import { ClientInstructionService } from 'src/app/service/client-instruction.service';
import { ProjectandpriorityService } from 'src/app/service/projectandpriority.service';



@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.scss'],
  providers: [dropDownFields]
})
export class AgentComponent implements OnInit, OnDestroy {
  amount = 0;
  clientInstructionInfoModal = false;
  to_be_concluded_bucket: any = {
    Count: 0,
    Display_Name: "To Be Concluded",
    Name: "To_be_Concluded"
  }
  conclusion_bucket: any = {
    Count: 0,
    Display_Name: "Concluded",
    Name: "Concluded"
  }
  instructionCount: Number = 0;
  Title = "Agent";
  /* utility*/
  showHighPriorityAccounts = false;
  callreferenceAcccounts = false;
  ResponseHelper: ResponseHelper;
  AllFields = [];
  ActionForm: FormGroup;
  Validated = false;
  Status = [];
  SubStatus = [];
  ActionCode = [];
  DenialCodes = [];
  SaagLookup = [];
  UserId = 0;
  ClientId = 0;
  InventoryLogId = 0;
  InventoryId = 0;
  Buckets = [];
  InsurancePayerName = "";
  InsuranceData;
  OpenNotesGenerator = false;
  OpenAccountsModal = false;
  OpenInsuranceMaster = false;
  AgentSaag = [];
  BCBAssistance = [];
  DisplaySaag: boolean = false;
  DisplayDenialCode: boolean = false;
  ClientUpdateData = []
  DisplayClientUpdate: boolean = false;
  DisplayNotepad: boolean = false;
  DisplayMystat: boolean = false;
  DisplayBreak: boolean = false;
  NoteValue;
  MyStat;
  agentBreak;
  ActiveBucket = "";
  AccountsList = [];
  LocalAccounts = [];
  DisplayMain = false;
  MinDate: Date;
  statCalucualted: boolean = false
  DisplayMessage: string = "Please click on the Bucket to continue.";
  viewUtil: boolean = true;
  DisplayAppeal: boolean = false;
  AppealType = '';
  CurrentPayerName = '';
  CheckTemplates = [];
  IdentityProofList = {
    Merged_Template_Url: '', CoverLetter: '', AppealLetter: '', TemplateList: [
      { Template_Name: "CMS", Display_Name: "CMS", Upload_URL: '', Filename: 'No File Chosen', FileBase64: '' },
      { Template_Name: "Primary_EOB", Display_Name: "Primary EOB", Upload_URL: '', Filename: 'No File Chosen', FileBase64: '' },
      { Template_Name: "Secondary_EOB", Display_Name: "Secondary EOB", Upload_URL: '', Filename: 'No File Chosen', FileBase64: '' },
      { Template_Name: "POTF", Display_Name: "POTF", Upload_URL: '', Filename: 'No File Chosen', FileBase64: '' },
      { Template_Name: "Medical_Record", Display_Name: "Medical Record", Upload_URL: '', Filename: 'No File Chosen', FileBase64: '' },
      { Template_Name: "W9_Form", Display_Name: "W9 Form", Upload_URL: '', Filename: 'No File Chosen', FileBase64: '' }
    ]
  }
  Insurance_Id = 0;
  GUIDList = [];
  Client_Name = '';
  DisableSubmit = false;
  Deallocated = false;
  action_Code;
  CommentHistory = [];
  ToggleCommentHistory = false;
  DisplayBcbs: boolean = false;
  clientUserModal = false;
  enableClientUserMapping = null;
  menuStatus = false;
  showCallReferenceInfo = false;
  CallReference_No = null;
  Is_New_Line = false;
  showAddPCNModal = false;
  inventoryDetails = {};
  userdata: any;
  clientObj: any = {};

  // concluder section 
  openToBeConcludedBucketModal = false;
  openConclusionBucketModal = false;
  concluderId = null;
  activeReasonBucket = null;
  openPAndPModal = false;
  PNP_Inventory_Id = null;
  PNP_Inventory_Log_Id = null;
  constructor(
    private router: Router,
    private notificationservice: NotificationService,
    private analyticsService: AnalyticsService,
    private clientInstructionService: ClientInstructionService,
    public projectandpriorityService: ProjectandpriorityService,
    private agentservice: AgentService,
    private saagservice: SaagService,
    private globalservice: GlobalInsuranceService,
    private dropdownservice: DropdownService,
    private fb: FormBuilder,

    private commonservice: CommonService,
    private denialcodeservice: DenialCodeService,
    private clientService: ClientService,
    private concluderService: ConcluderService) { }

  ngOnInit() {
    sessionStorage.removeItem('localPCN');
    sessionStorage.removeItem('lastPCN');
    this.ResponseHelper = new ResponseHelper(this.notificationservice);
    var token = new Token(this.router);
    this.userdata = token.GetUserData();
    this.UserId = this.userdata.UserId;
    this.ClientId = this.userdata.Clients[0].Client_Id;
    this.Client_Name = this.userdata.Clients[0].Client_Name;
    this.GetBucketsWithCount();
    this.CreateActionForm();
    sessionStorage.removeItem("Accounts");
    this.MinDate = new Date('01/01/1974');
    this.getButtonStatus();

    setTimeout(() => {
      $('.utility-menu').hide();
    }, 1000);
    this.getClientID();
    this.getClientInstructionInformation();
  }
  ngOnDestroy() {
    this.projectandpriorityService.showProjectModal = false;
  }

  getClientInstructionInformation() {
    this.clientInstructionService.getClientInstructionInformation(this.ClientId).subscribe((response: any) => {
      console.log('getClientInstructionInformation response : ', response);
      if (response.Data && response.Data.InstructionCheck == true) {
        this.clientInstructionInfoModal = true;
      }
      // this.amount = 100;
      // this.clientInstructionInfoModal = response && response.InstructionCheck ? response.InstructionCheck : false;
    }, (error) => {
      this.clientInstructionInfoModal = false;
      console.log('getClientInstructionInformation error : ', error);
    })

  }

  toggleMenu() {
    this.menuStatus = !this.menuStatus;
    console.log('toggleMenu() : ', this.menuStatus);
    if (this.menuStatus == true) {
      $('.utility-menu').show();
    }
    else {
      $('.utility-menu').hide();
    }
  }
  GetBucketsWithCount() {
    sessionStorage.removeItem('highPriporityAccount');
    localStorage.removeItem('callReference');
    // sessionStorage.removeItem('localPCN');
    // sessionStorage.removeItem('lastPCN');
    this.agentservice.GetBucketsWithCount(this.ClientId).pipe(finalize(() => {
    })).subscribe(
      res => {
        this.ClientId = res.json().Data.ClientId;
        this.Buckets = res.json().Data.Buckets;
        var abc = this.Buckets.filter(i => {
          if (i.Display_Name == "TL Deny") { }
        })
        this.GetSaagLookup();
      },
      err => {
        this.ResponseHelper.GetFaliureResponse(err);
        this.GetSaagLookup();
      }
    );
  }

  GetAccountList(bucket, fromsubmit) {
    console.log('debug bucket : ', bucket)
    this.agentservice.GetAccountList(this.ClientId, bucket.Name).pipe(finalize(() => {
      this.GetBucketsWithCount();
    })).subscribe(
      res => {
        bucket.disableBtn = false;
        this.AccountsList = res.json().Data.Inventory_Info;
        console.log('debug this.AccountsList : ', this.AccountsList);
        if (this.AccountsList.length > 0) {
          // this.InventoryId = this.AccountsList[0].Inventory_Id;
          // this.InventoryLogId = this.AccountsList[0].Inventory_Log_Id;


          if (bucket.Name.indexOf('Appeal') == -1) {
            if (this.AccountsList[0].Inventory_Log_Id) {
              this.InventoryLogId = this.AccountsList[0].Inventory_Log_Id;
            }
            else {
              this.InventoryLogId = 0;
            }
            this.GetAllFields(bucket, this.AccountsList[0].Inventory_Id, false);
          }
          // this.MapInventoryLogId();
          // this.viewUtil = true;
        }

        if (fromsubmit == false) {
          this.OpenAccountsModal = true;
        }
        else {
          if (bucket.Name.indexOf('Appeal') == -1) {
            this.GetAllFields(bucket, this.AccountsList[0].Inventory_Id, false);
          }
          else {
            this.InventoryId = 0;
            this.InventoryLogId = 0;
            this.AllFields = [];
            this.DisplayMain = false;
            this.DisplayMessage = "Please click on Bucket to continue";
            this.ActiveBucket = '';
          }
        }
        this.SaveAccountsInLocal(bucket.Name, this.AccountsList[0].Inventory_Id);
      },
      err => {
        bucket.disableBtn = false;
        if (fromsubmit == true) {
          this.DisplayMain = false;
          this.AllFields = [];
          this.DisplayMessage = "No Accounts In Current Bucket \n Please select another one";
          this.InventoryId = 0;
          this.InventoryLogId = 0;
        }
        else {
          // this.DisplayMain = false;
          // this.AllFields = [];
          // this.DisplayMessage = "No Accounts In Current Bucket \n Please select another one";
          // this.ActiveBucket = "";
          this.OpenAccountsModal = false;
          this.ResponseHelper.GetFaliureResponse(err);
        }

      }
    );
  }

  SaveAccountsInLocal(Bucket_Name, inventoryId) {
    console.log('SaveAccountsInLocal Bucket_Name : ', Bucket_Name)
    this.AccountsList.forEach(e => {
      e.Processed = "Pending";
      e.Bucket_Name = Bucket_Name && Bucket_Name.Name ? Bucket_Name.Name : Bucket_Name;
      if (e.Inventory_Id == inventoryId) {
        e.Processed = "Working";
      }
      e[e.Group_By_Field_Header] = e.Group_By_Field_Value;
    })
    if (!Bucket_Name.includes("Appeal") && Bucket_Name != "Private_To_Call" && Bucket_Name != "TL_Deny") {
      this.AccountsList.forEach(e => {
        this.LocalAccounts.push(e);
      })
    }
    else {
      this.LocalAccounts = this.LocalAccounts.filter(function (item) {
        return item.Bucket_Name != Bucket_Name
      });

      this.AccountsList.forEach(e => {
        this.LocalAccounts.push(e);
      })
    }
    sessionStorage.setItem("Accounts", JSON.stringify(this.LocalAccounts));
  }

  CheckPendingAccount(bucketname) {
    var Pending = false;
    this.LocalAccounts.forEach(acc => {
      if (acc.Bucket_Name == bucketname) {
        Pending = true;
      }
    })
    return Pending;
  }

  CreateActionForm() {
    this.ActionForm = this.fb.group({
      'Status': ['', Validators.required],
      'SubStatus': ['', Validators.required],
      'ActionCode': ['', Validators.required],
      'WorkStatus': ['', Validators.required],
      'Notes': ['', Validators.required]
    });
  }

  BlockInput(event) {
    if (event.key == 'Backspace' || event.key == 'Tab') {
      return true;
    }
    else {
      return false;
    }

  }

  GetSaagLookup() {
    this.Status = [];
    this.saagservice.getSaagLookup(this.ClientId).subscribe(data => {
      this.SaagLookup = data.json().Data.SAAG_Lookup;
      let status = this.SaagLookup.map(function (obj) { return obj.Status; });
      this.Status = status.filter(function (item, pos) { return status.indexOf(item) == pos; })
      if (this.Status.length == 1) {
        this.ActionForm.patchValue({ "Status": this.Status[0] });
        this.OnStatusChange(this.Status[0])

      }
    }, err => {
      this.ResponseHelper.GetFaliureResponse(err)
    })
  }

  OnStatusChange(event) {
    console.log('OnStatusChange : ', event)
    this.ActionForm.patchValue({ "SubStatus": "" })
    this.ActionForm.patchValue({ "ActionCode": "" })
    this.SubStatus = [];
    let substatus = [];
    this.ActionCode = []
    if (!event.target) {
      this.SaagLookup.forEach(e => {
        if (e.Status == event) {
          substatus.push(e.Sub_Status)
        }
      })
    } else {
      this.SaagLookup.forEach(e => {
        if (e.Status == event.target.value) {
          substatus.push(e.Sub_Status)
        }
      })
    }

    this.SubStatus = substatus.filter(function (item, pos) {
      return substatus.indexOf(item) == pos;
    })
    if (this.SubStatus.length == 1) {
      this.ActionForm.patchValue({ "SubStatus": this.SubStatus[0] })

      this.OnSubStatusChange(this.SubStatus[0])
    }

  }

  OnSubStatusChange(event) {
    console.log('OnSubStatusChange : ', event)
    this.ActionForm.patchValue({ "ActionCode": "" })
    this.ActionCode = [];
    let actionCode = [];
    if (!event.target) {
      this.SaagLookup.forEach(e => {
        if (e.Sub_Status == event && e.Status == this.ActionForm.get('Status').value) {
          actionCode.push(e.Action_Code)
        }
      })
    } else {
      this.SaagLookup.forEach(e => {
        if (e.Sub_Status == event.target.value && e.Status == this.ActionForm.get('Status').value) {
          actionCode.push(e.Action_Code)
        }
      })
    }


    this.ActionCode = actionCode.filter(function (item, pos) {
      return actionCode.indexOf(item) == pos;
    })
    if (this.ActionCode.length == 1) {
      this.ActionForm.patchValue({ "ActionCode": this.ActionCode[0] })
    }
  }

  ToggleNotesGenerator(event) {
    if (event != null && event != false) {
      this.ActionForm.patchValue({ 'Notes': event })
    }
    this.OpenNotesGenerator = !this.OpenNotesGenerator;
  }

  ToggleInsuranceMaster() {
    if (!this.OpenInsuranceMaster) {
      this.GetInsuranceMaster();
    }
    else {
      this.OpenInsuranceMaster = !this.OpenInsuranceMaster;
    }

  }
  GetInsuranceMaster() {

    let obj = { "Client_Id": this.ClientId, "Payer_Name": this.InsurancePayerName }
    this.globalservice.GetInsuranceMaster(obj).pipe(finalize(() => {

    })).subscribe(
      res => {
        this.InsuranceData = res.json().Data;
        this.OpenInsuranceMaster = !this.OpenInsuranceMaster;
      },
      err => {
        this.ResponseHelper.GetFaliureResponse(err);
      }
    );
  }

  MarkLocalAccountComplete() {
    this.LocalAccounts = sessionStorage.getItem("Accounts") ? JSON.parse(sessionStorage.getItem("Accounts")) : [];
    this.LocalAccounts.forEach(e => {
      if (e.Bucket_Name == this.ActiveBucket && e.Inventory_Id == this.InventoryId && e.Processed == 'Working') {
        e.Processed = "Complete";
      }
    });
    sessionStorage.setItem("Accounts", JSON.stringify(this.LocalAccounts));
  }

  CheckAllInventoryComplete() {
    var AllComplete = false;
    var currentbucket = []
    this.LocalAccounts.forEach(e => {
      if (e.Bucket_Name == this.ActiveBucket) {
        currentbucket.push(e);

      }
    })
    currentbucket.forEach(e => {
      if (e.Processed == "Complete") {
        AllComplete = true;
      }
      else AllComplete = false;
    })

    return AllComplete
  }

  AssignNextInventory() {
    // if(this.ActiveBucket.includes("Appeal") || this.ActiveBucket == "Private_To_Call" || this.ActiveBucket)
    if (this.CheckAllInventoryComplete()) {
      this.InventoryLogId = 0;
      this.InventoryId = 0;
      this.GetAccountList({ 'Name': this.ActiveBucket }, true);
      this.getInstructionCount();
      this.LocalAccounts = this.LocalAccounts.filter(e => e.Bucket_Name != this.ActiveBucket);
      sessionStorage.setItem("Accounts", JSON.stringify(this.LocalAccounts));
    }
    else {
      this.AccountsList = [];
      this.LocalAccounts.forEach(e => {
        if (e.Bucket_Name == this.ActiveBucket && e.Processed != "Complete")
          this.AccountsList.push(e);
      })
      // this.InventoryId = this.AccountsList[0].Inventory_Id;
      // this.InventoryLogId = this.AccountsList[0].Inventory_Log_Id;
      if (!this.ActiveBucket.includes("Appeal")) {
        this.GetAllFields({ Name: this.ActiveBucket }, this.AccountsList[0].Inventory_Id, false);
      }
      else {
        this.InventoryId = 0;
        this.InventoryLogId = 0;
        this.AllFields = [];
        this.DisplayMain = false;
        this.DisplayMessage = "Please click on Bucket to continue"
      }


    }
  }

  ClearForm() {
    this.Validated = false;
    // this.Is_New_Line = false;
    this.CreateActionForm();
  }

  SubmitForm() {

    this.Validated = true;
    console.log('SubmitForm() : ', this.ActionForm.value);
    if (this.ActionForm.valid) {
      var objs = new Object();
      objs['Client_Id'] = this.ClientId;
      objs['Inventory_Id'] = this.InventoryId;
      objs['Inventory_Log_Id'] = this.InventoryLogId;
      objs['Notes'] = this.ActionForm.controls['Notes'].value;
      console.log('Before this.AllFields : ', this.AllFields);
      this.AllFields.forEach(e => {
        console.log('loop ele : ', e.Header_Name, e);
        if (e.Header_Name == "Notes") {
          e.FieldValue = this.ActionForm.controls['Notes'].value;
        }
        else if (e.Column_Datatype == 'Date') {
          // moment().utcOffset(0, true).format()
          if (e && e.FieldValue != null) {

            objs[e.Header_Name] = moment(e.FieldValue).utcOffset(0, true).format();
          }
          else {
            objs[e.Header_Name] = moment().utcOffset(0, true).format();
          }
        }
        else {
          objs[e.Header_Name] = e.FieldValue;
        }
      });
      console.log('Bucket_Name : ', this.ActiveBucket);
      objs["Bucket_Name"] = this.ActiveBucket;
      objs["Status"] = this.ActionForm.controls['Status'].value;
      objs["Sub-Status"] = this.ActionForm.controls['SubStatus'].value;
      objs["Sub_Status"] = this.ActionForm.controls['SubStatus'].value;
      objs["Action_Code"] = this.ActionForm.controls['ActionCode'].value;
      objs["Account_Status"] = this.ActionForm.controls['WorkStatus'].value;

      var obj = new Object();
      obj['Fields'] = objs;
      console.log('obj : ', obj['Fields']);
      this.DisableSubmit = true;
      // console.log('SubmitForm obj : ', JSON.stringify(obj));
      localStorage.removeItem('callReference');
      sessionStorage.removeItem('highPriporityAccount');
      sessionStorage.removeItem('localPCN');
      sessionStorage.removeItem('lastPCN');

      if (this.Is_New_Line == true) {
        this.submitAddNewLine(obj);
        return true;
      }
      if (this.ActiveBucket == "Concluded") {
        console.log('Conclusion : ', obj);
        // this.DisableSubmit = false;
        this.submitConclusion(obj);
        return true;
      }
      if (this.ActiveBucket == "PNP") {
        this.submitPNPForm(obj);
        return true;
      }
      this.agentservice.SaveAllFields(obj).pipe(finalize(() => {
        this.GetBucketsWithCount();
        this.DisableSubmit = false;
      })).subscribe(
        res => {
          this.ClearForm();
          this.ResponseHelper.GetSuccessResponse(res);
          this.MarkLocalAccountComplete();
          this.AssignNextInventory();
          if (this.ActiveBucket.indexOf('Appeal') != -1) {
            this.ClearPdfStorage();
          }
          // this.InventoryId = 0;
        },
        err => {

          if (err.status == 403) {
            sessionStorage.removeItem("Accounts");
            this.InventoryId = 0;
            this.ActiveBucket = '';
            this.ClearForm();
            this.LocalAccounts = [];
            this.AccountsList = [];
            this.GetAllTouchedAccounts();
          }
          if (err.status == 406) {
            this.RemoveAccountFromLocal();
            this.OpenAccountsModal = false;
            this.DisplayMain = false;
            this.DisplayMessage = "This Account is already in special queue";
            this.InventoryId = 0;
            // this.InventoryLogId = 0;
            this.ActiveBucket = '';
            this.ClearForm();
            this.AccountsList = [];
          }
          this.ResponseHelper.GetFaliureResponse(err);
        }
      );
    }
  }

  submitPNPForm(data) {
    data.Fields.PNP_Inventory_Log_Id = this.PNP_Inventory_Log_Id;
    data.Fields.PNP_Inventory_Id = this.PNP_Inventory_Id;
    delete data.Fields.Inventory_Log_Id;
    delete data.Fields.Inventory_Id;
    this.projectandpriorityService.submitPNPForm(data).subscribe((response) => {
      console.log('submitPNPForm response : ', response);
      this.GetBucketsWithCount();
      this.assignNextInventory();

      this.ResponseHelper.GetSuccessResponse(response);
    }, (error) => {
      console.log('submitPNPForm error : ', error);

      this.ResponseHelper.GetFaliureResponse(error);
      this.Validated = false;
      this.DisableSubmit = false;
      this.GetBucketsWithCount();
    })
    console.log('submitPNPForm(data) : ', data);
  }
  assignNextInventory() {
    let localAccounts = this.projectandpriorityService.getLocalAccount();
    console.log('submitPNPForm assignNextInventory localAccounts : ', localAccounts);
    console.log('submitPNPForm assignNextInventory before', this.PNP_Inventory_Id)
    const matchedIndex = localAccounts.findIndex((element, index) => {
      if (element.PNP_Inventory_Id == this.PNP_Inventory_Id) {
        // localAccounts.splice(index, 1)
        return element;
      }
    });
    console.log('submitPNPForm assignNextInventory matchedIndex : ', matchedIndex);
    if (matchedIndex != undefined && matchedIndex >= 0) {
      localAccounts.splice(matchedIndex, 1)
    }
    // localAccounts = JSON.parse(JSON.stringify(localAccounts))
    console.log('submitPNPForm assignNextInventory before', localAccounts)
    if (localAccounts.length > 0) {
      const { Clients } = this.userdata;
      const { PNP_Inventory_Id } = localAccounts[0];
      // this.PNP_Inventory_Id = PNP_Inventory_Id;
      // this.PNP_Inventory_Log_Id = PNP_Inventory_Log_Id;
      console.log('submitPNPForm assignNextInventory after', PNP_Inventory_Id)

      this.projectandpriorityService.updatePNPTime(Clients[0].Client_Id, PNP_Inventory_Id, this.PNP_Inventory_Log_Id).subscribe((response: any) => {
        console.log('submitPNPForm updatePNPTime response : ', response, localAccounts, localAccounts.length);
        this.ResponseHelper.GetSuccessResponse(response);
        this.PNP_Inventory_Log_Id = response.Data;
        localAccounts[0].PNP_Inventory_Log_Id = this.PNP_Inventory_Log_Id;
        this.projectandpriorityService.setLocalAccount(localAccounts);
        this.getAllPNPFields(localAccounts[0], true);
      }, (error) => {
        console.log('updatePNPTime error : ', error);
        this.ResponseHelper.GetFaliureResponse(error);
        this.Validated = false;
        this.DisableSubmit = false;
      });
    }
    else {
      this.DisplayMain = false;
      this.DisplayMessage = "Please click on Bucket to continue";
      this.ActiveBucket = '';
      this.activeReasonBucket = '';
      this.projectandpriorityService.setLocalAccount(localAccounts);
    }
    console.log('assignNextInventory : ', localAccounts);
  }

  getAllPNPFields(data, status) {
    console.log('getAllFields data : ', data);
    const { PNP_Inventory_Id, PNP_Inventory_Log_Id } = data;
    const { Clients } = this.userdata;
    this.projectandpriorityService.getPNPFields(Clients[0].Client_Id, PNP_Inventory_Id, PNP_Inventory_Log_Id, this.activeReasonBucket)
      .subscribe((response) => {
        console.log('getPNPFields response : ', response);
        // this.Acc = response.Data;
        // this.projectandpriorityService.setLocalAccount(this.AccountsList);
        this.PNPAccountClick({ AccountsList: response.Data, PNP_Inventory_Id: PNP_Inventory_Id, PNP_Inventory_Log_Id: PNP_Inventory_Log_Id, closePopup: true, activeReasonBucket: this.activeReasonBucket });
        this.Validated = false;
        this.DisableSubmit = false;
        // this.PNPAccountClick(event)
      }, (error) => {
        console.log('getPNPFields error : ', error);
        this.Validated = false;
        this.DisableSubmit = false;
        this.ResponseHelper.GetFaliureResponse(error);
        this.ActionForm.patchValue({ Status: '', SubStatus: '', ActionCode: '', WorkStatus: '', Notes: '' });
      });
  }

  ClearPdfStorage() {
    this.IdentityProofList = {
      Merged_Template_Url: '', CoverLetter: '', AppealLetter: '', TemplateList: [
        { Template_Name: "CMS", Display_Name: "CMS", Upload_URL: '', Filename: 'No File Chosen', FileBase64: '' },
        { Template_Name: "Primary_EOB", Display_Name: "Primary EOB", Upload_URL: '', Filename: 'No File Chosen', FileBase64: '' },
        { Template_Name: "Secondary_EOB", Display_Name: "Secondary EOB", Upload_URL: '', Filename: 'No File Chosen', FileBase64: '' },
        { Template_Name: "POTF", Display_Name: "POTF", Upload_URL: '', Filename: 'No File Chosen', FileBase64: '' },
        { Template_Name: "Medical_Record", Display_Name: "Medical Record", Upload_URL: '', Filename: 'No File Chosen', FileBase64: '' },
        { Template_Name: "W9_Form", Display_Name: "W9 Form", Upload_URL: '', Filename: 'No File Chosen', FileBase64: '' }
      ]
    }

    this.GUIDList = [];
  }

  GetAllTouchedAccounts() {
    this.agentservice.GetAllTouchedAccounts(this.ClientId).pipe(finalize(() => {
      this.GetBucketsWithCount();
    })).subscribe(
      res => {
        res.json().Data.Inventory_Info.forEach(e => {
          this.LocalAccounts.push(e);
        })
        sessionStorage.setItem("Accounts", JSON.stringify(this.LocalAccounts));
        this.DisplayMain = false;
        this.DisplayMessage = "Please click on the Bucket to continue.";
      },
      err => {
        this.ResponseHelper.GetFaliureResponse(err);
      }
    );
  }

  showSaag() {
    this.DisplaySaag = true
  }

  showDenialCode() {
    this.DisplayDenialCode = true;
  }

  ToggleSaagModal(event) {
    this.DisplaySaag = !this.DisplaySaag;
  }

  ToggleDenialCodeModal(event) {
    this.DisplayDenialCode = !this.DisplayDenialCode;
  }

  ToggleClientModal() {
    this.DisplayClientUpdate = !this.DisplayClientUpdate
  }
  getClientID() {
    this.clientService.getClient(this.userdata.TokenValue, this.ClientId).subscribe((res) => {
      console.log('getClient data : ', res.json());
      this.clientObj = res.json().Data;
    }, (error) => {
      this.clientObj = {};
      console.log('getClientUpdate error: ', error);
    })
  }
  showClientUpdate() {
    this.agentservice.getClientUpdate(this.ClientId).pipe(finalize(() => {

    })).subscribe(res => {

      let data = res.json()
      this.ClientUpdateData = data.Data
      this.DisplayClientUpdate = true
    }, err => {
      this.ResponseHelper.GetFaliureResponse(err);
    })
  }
  showInotePad() {
    this.DisplayNotepad = true;
  }
  ToggleNotepadModal(val) {
    this.NoteValue = val
    this.DisplayNotepad = !this.DisplayNotepad
  }
  showMystat() {
    console.log('showMystat() : ', this.DisplayMystat);
    this.DisplayMystat = true;
  }
  ToggleMyStatModal(e) {
    console.log('ToggleMyStatModal() : ', this.DisplayMystat);
    this.statCalucualted = true
    this.DisplayMystat = !this.DisplayMystat
  }
  showBreak() {
    this.agentBreak = { "InventoryLogId": this.InventoryLogId, "Client_Id": this.ClientId, "Agent_Id": this.UserId }
    this.DisplayBreak = true
  }
  ToggleBreakModal() {
    this.DisplayBreak = !this.DisplayBreak
  }
  ngAfterViewInit() {

    this.getAgetnSaagValue();
    this.getBCBSAssistance();
    this.getAgentStat()
    this.getInstructionCount();
    this.getDenialCode();


  }
  getInstructionCount() {

    this.agentservice.GetCount(this.ClientId).subscribe(res => {
      this.instructionCount = res.json().Data.Count;
    }, err => {
      this.instructionCount = 0;

    })
  }
  getAgetnSaagValue() {
    this.agentservice.getAgentSaag(this.ClientId).subscribe(res => {
      let data = res.json()
      this.AgentSaag = data.Data

    }, err => {
      this.ResponseHelper.GetFaliureResponse(err);
    })
  }
  getAgentStat() {
    this.agentservice.getMyStat(this.ClientId).subscribe(res => {
      let data = res.json()
      this.MyStat = data.Data
    }, err => {
      this.ResponseHelper.GetFaliureResponse(err);
    })
  }

  getDenialCode() {
    if (this.ClientId) {
      this.denialcodeservice.GetAllDenialCode(this.ClientId).subscribe(res => {
        let data = res.json()
        this.DenialCodes = data.Data
      }, err => {
        this.ResponseHelper.GetFaliureResponse(err);
      })
    }
  }

  ToggleAccountsModal(bucket) {
    console.log('ToggleAccountsModal bucket : ', bucket);
    this.activeReasonBucket = null;
    this.projectandpriorityService.removeLocalAccount();
    this.PNP_Inventory_Id = null;
    this.PNP_Inventory_Log_Id = null;
    this.projectandpriorityService.showProjectModal = false;
    if (bucket && bucket.Name != false && bucket.Name != true) {
      sessionStorage.removeItem('Accounts');
      const highPriority = sessionStorage.getItem('highPriporityAccount');
      const callReference = localStorage.getItem('callReference');
      sessionStorage.removeItem('conclusionBucket');
      if (highPriority != undefined) {
        this.GetAccountList(bucket, false);
        sessionStorage.removeItem('highPriporityAccount');
      }
      if (callReference != undefined) {
        this.GetAccountList(bucket, false);
        localStorage.removeItem('callReference');

      }

      this.analyticsService.logEvent(bucket.Name + ' Click').subscribe((response) => {
        console.log('logEvent : ', response);
      }, (error) => {
        console.log('logEvent : ', error);
      });
      bucket.disableBtn = true;
      // var bucketname = this.ActiveBucket;
      this.ActiveBucket = bucket.Name == "Concluded" ? this.ActiveBucket : bucket.Name;
      if (bucket.Name != 'To_be_Concluded') {
        this.concluderId = null;
      }
      if (bucket.Name.includes("Appeal") || bucket.Name == "Private_To_Call" || bucket.Name == "TL_Deny") {
        this.GetAccountList(bucket, false);
      }
      else if (bucket.Name == 'To_be_Concluded') {
        // call concluder to be done service
        this.toBeConcluded();
      }
      else if (bucket.Name == "Concluded") {
        this.conclusionBucket();
      }
      else {
        if (!this.CheckPendingAccount(bucket.Name)) {
          this.GetAccountList(bucket, false);
        }
        else {
          this.LocalAccounts = sessionStorage.getItem("Accounts") ? JSON.parse(sessionStorage.getItem("Accounts")) : [];
          this.AccountsList = [];
          this.LocalAccounts.forEach(e => {
            if (e.Bucket_Name == bucket.Name && e.Processed != "Complete")
              this.AccountsList.push(e);
          });
          if (this.AccountsList && this.AccountsList.length == 0) {
            this.GetAccountList(bucket, false);
            return false;
          }
          if (this.ActiveBucket != bucket.Name) {
            if (bucket.Name.indexOf('Appeal') == -1) {
              this.GetAllFields(bucket, this.AccountsList[0].Inventory_Id, false);
            }
          }
          if (this.AccountsList.length > 0) {
            this.OpenAccountsModal = true;
          }
        }
      }
    }
    else {
      this.OpenAccountsModal = !this.OpenAccountsModal;
    }
  }

  openConcludedBucketModal() {

  }

  toBeConcluded() {
    this.openToBeConcludedBucketModal = true;
    // this.concluderId = null;
  }

  conclusionBucket() {
    this.openConclusionBucketModal = true;
    this.concluderId = null;
    console.log('conclusionBucket() : ', this.ActiveBucket);
    // this.ActiveBucket = null;
  }

  closeConclusionModal(event) {
    this.openConclusionBucketModal = false;

    // this.DisplayMain = false;
    // this.DisplayMessage = "Please click on Bucket to continue";
    // this.ActiveBucket = '';
  }

  CloseConcluderModal(event) {
    console.log('CloseConcluderModal : ', event);
    this.openToBeConcludedBucketModal = false;
    // this.DisplayMain = false;
    // this.DisplayMessage = "Please click on Bucket to continue";
    // this.ActiveBucket = '';
  }
  concluderInventoryData() {
    console.log('concluderInventoryData() : ');
    this.concluderService.getConcluderInventoryData().subscribe((response) => {
      console.log('concluderInventoryData response : ', response);
      this.OpenAccountsModal = true;
      if (this.AccountsList[0].Inventory_Log_Id) {
        this.InventoryLogId = this.AccountsList[0].Inventory_Log_Id;
      }
      else {
        this.InventoryLogId = 0;
      }
      this.SaveAccountsInLocal("To_be_Concluded", this.AccountsList[0].Inventory_Id)
      this.ResponseHelper.GetSuccessResponse(response);
    }, (error) => {
      console.log('concluderInventoryData error : ', error);
      this.ResponseHelper.GetFaliureResponse(error);
    })
  }


  concluderRowClick(event) {
    console.log('concluderRowClick : ', event);
    this.activeReasonBucket = null;
    sessionStorage.removeItem('conclusionBucket');
    if (event) {
      this.AllFields = JSON.parse(JSON.stringify(event.fields));
      this.DisplayMain = true;
      this.ActiveBucket = event.Bucket_Name;
      this.concluderId = event.concluderId;
    }
    if (event.closePopup == true) {
      this.openToBeConcludedBucketModal = false;
    }
    if (this.AllFields && this.AllFields.length == 0) {
      this.DisplayMain = false;
      this.DisplayMessage = "Please click on Bucket to continue";
      this.ActiveBucket = '';
      this.concluderId = null;
    }
    this.GetBucketsWithCount();
  }

  conclusionRowClick(data) {
    console.log('conclusionRowClick(data) : ', data);
    const bucket = sessionStorage.getItem('conclusionBucket');
    if (bucket != null) {
      this.activeReasonBucket = bucket;
    }
    else {
      this.activeReasonBucket = null;
    }
    this.ActionForm.patchValue({ Status: '', SubStatus: '', ActionCode: '', WorkStatus: '', Notes: '' });
    if (data && data.AccountsList && data.AccountsList.length > 0) {
      this.DisplayMain = true;
      this.ActiveBucket = "Concluded";
      this.AllFields = data.AccountsList;
    }
    this.concluderId = data.concluderId;
    if (data.status == true) {
      this.openConclusionBucketModal = false;
    }
    this.setStatus();
  }

  ChangeWorkingStatusInLocal(bucketname: string) {
    this.LocalAccounts = sessionStorage.getItem("Accounts") ? JSON.parse(sessionStorage.getItem("Accounts")) : [];
    this.LocalAccounts.forEach(e => {
      if (e.Inventory_Id == this.InventoryId && e.Processed != "Complete" && e.Bucket_Name == bucketname) {
        e.Processed = "Working";
      }
      else if (e.Processed != "Complete") e.Processed = "Pending";
    });

    sessionStorage.setItem("Accounts", JSON.stringify(this.LocalAccounts));
  }

  GetAllFields(bucket, obj, fromPopup) {
    this.Is_New_Line = false;
    console.log('Before GetAllFields bucket : ', bucket, obj, this.InventoryLogId);
    this.InventoryLogId = (obj.Inventory_Log_Id != null && obj.Inventory_Log_Id > 0) ? obj.Inventory_Log_Id : (this.InventoryLogId != null ? this.InventoryLogId : 0);
    // console.log('After GetAllFields bucket : ', bucket, obj, this.InventoryLogId);
    // sessionStorage.removeItem('localPCN');
    // sessionStorage.removeItem('lastPCN');
    var oldinvenid = this.InventoryId;
    var oldinvenlogid = this.InventoryLogId;
    if (fromPopup === true) {
      bucket.Name = obj.Bucket_Name;
      bucket.Inventory_Log_Id = obj.Inventory_Log_Id ? obj.Inventory_Log_Id : null;
      this.InventoryId = obj.Inventory_Id;
      // this.concluderId = null;
      // this.InventoryLogId = bucket.Inventory_Log_Id ? bucket.Inventory_Log_Id : 0;
    }
    else {
      this.InventoryId = obj;
    }
    if (oldinvenid != 0) {
      var formobj = {};
      var existinglogid = this.InventoryLogCheck(bucket.Name)
      if (existinglogid == 0) {
        formobj = { Client_Id: this.ClientId, Bucket_Name: bucket.Name, Inventory_Id: this.InventoryId, Old_Inventory_Log_Id: oldinvenlogid, Insert_Log: true };
      }
      else {
        if (oldinvenlogid == existinglogid) {
          oldinvenlogid = this.GetLogFromInventoryId(oldinvenid)
        }
        formobj = { Client_Id: this.ClientId, Bucket_Name: bucket.Name, Inventory_Id: this.InventoryId, Old_Inventory_Log_Id: oldinvenlogid, New_Inventory_Log_Id: existinglogid, Insert_Log: false };
      }
      this.UpdateInventoryTime(bucket, formobj, fromPopup, this.InventoryId);

    }
    else {
      console.log('In Else bucket : ', bucket);
      if (bucket.Name.indexOf('Appeal') != -1) {
        var Is_Appeal_First = true;
        // if (this.Deallocated === true) {
        //   Is_Appeal_First = false;
        // }
        var formobj = {};
        var existinglogid = this.InventoryLogCheck(bucket.Name);
        if (existinglogid == 0) {
          formobj = { Client_Id: this.ClientId, Bucket_Name: bucket.Name, Inventory_Id: this.InventoryId, Old_Inventory_Log_Id: 0, Insert_Log: true, Is_Appeal_First: Is_Appeal_First };
        }
        else {
          formobj = { Client_Id: this.ClientId, Bucket_Name: bucket.Name, Inventory_Id: this.InventoryId, Old_Inventory_Log_Id: existinglogid, Insert_Log: false, Is_Appeal_First: Is_Appeal_First };
        }

        this.UpdateInventoryTime(bucket, formobj, fromPopup, this.InventoryId)
      }
      else {
        if (this.InventoryLogId == 0) {
          var res = this.InventoryLogCheck(bucket.Name);
          if (res != 0) {
            formobj = { Client_Id: this.ClientId, Bucket_Name: bucket.Name, Inventory_Id: this.InventoryId, New_Inventory_Log_Id: res, Only_Insert: true }
          }
          else {
            formobj = { Client_Id: this.ClientId, Bucket_Name: bucket.Name, Inventory_Id: this.InventoryId, New_Inventory_Log_Id: 0, Only_Insert: true }
          }
          this.UpdateInventoryTime(bucket, formobj, fromPopup, this.InventoryId);
        }
        else {
          this.GetAllFieldsApiCall(bucket, this.InventoryId, fromPopup);
        }
      }
    }
  }

  GetAllFieldsApiCall(bucket, inventoryId: number, fromPopup: boolean) {
    console.log('GetAllFields bucket, inventoryId, fromPopup : ', bucket, inventoryId, this.InventoryLogId);
    this.agentservice.GetAllFields(this.ClientId, inventoryId, this.InventoryLogId, bucket.Name).pipe(finalize(() => {
      // this.ClearForm();
      this.Validated = false;
    })).subscribe(
      res => {
        bucket.disableBtn = false;
        this.AllFields = res.json().Data;
        console.log('GetAllFields this.AllFields : ', this.AllFields);
        this.ManageNullFields();
        this.MapActionFields();
        this.ChangeWorkingStatusInLocal(bucket.Name);
        this.ActiveBucket = bucket.Name;
        this.DisplayMain = true;
        if (fromPopup == true) {
          this.OpenAccountsModal = false;
        }
      },
      err => {

        this.ResponseHelper.GetFaliureResponse(err);
      }
    );
  }
  MapActionFields() {
    this.AllFields.forEach(e => {
      switch (e.Header_Name) {
        case 'Id':
          this.InventoryLogId == e.FieldValue;
          break;
        case 'Status':
          this.ActionForm.patchValue({ Status: e.FieldValue });
          break;
        case 'Sub_Status':
          var substatus = [];
          this.SaagLookup.forEach((e) => {
            if (e.Status == this.ActionForm.get('Status').value) {
              substatus.push(e.Sub_Status);
            }
          });

          this.SubStatus = substatus.filter(function (item, pos) {
            return substatus.indexOf(item) == pos;
          });
          this.ActionForm.patchValue({ SubStatus: e.FieldValue });
          break;
        case 'Action_Code':
          let actionCode = [];
          this.SaagLookup.forEach((e) => {
            if (
              e.Sub_Status == this.ActionForm.get('SubStatus').value &&
              e.Status == this.ActionForm.get('Status').value
            ) {
              actionCode.push(e.Action_Code);
            }
          });

          this.ActionCode = actionCode.filter(function (item, pos) {
            return actionCode.indexOf(item) == pos;
          });
          this.ActionForm.patchValue({ ActionCode: e.FieldValue });
          break;
        // case 'Account_Status':
        //   this.ActionForm.patchValue({ WorkStatus: e.FieldValue });
        //   break;
        case 'Notes':
          this.ActionForm.patchValue({ Notes: e.FieldValue });
          break;
      }
    })
  }

  RemoveAccountFromLocal() {
    this.LocalAccounts = sessionStorage.getItem("Accounts") ? JSON.parse(sessionStorage.getItem("Accounts")) : [];
    var thisref = this;
    this.LocalAccounts = this.LocalAccounts.filter(function (item) {
      return (item.Inventory_Id != thisref.InventoryId);
    })
    sessionStorage.setItem("Accounts", JSON.stringify(this.LocalAccounts));
  }

  GetLogFromInventoryId(oldinvenid: number): number {
    var res = 0;
    this.LocalAccounts = sessionStorage.getItem("Accounts") ? JSON.parse(sessionStorage.getItem("Accounts")) : [];
    this.LocalAccounts.forEach(e => {
      if (e.Inventory_Id == oldinvenid) {
        if (e.Inventory_Log_Id != null) {
          res = e.Inventory_Log_Id
        }
      }
    });
    return res;
  }

  InventoryLogCheck(bucketname) {
    var res = 0;
    this.LocalAccounts = sessionStorage.getItem("Accounts") ? JSON.parse(sessionStorage.getItem("Accounts")) : [];
    this.LocalAccounts.forEach(e => {
      if (e.Inventory_Id == this.InventoryId && e.Bucket_Name == bucketname) {
        if (e.Inventory_Log_Id != null) {
          res = e.Inventory_Log_Id
        }
      }
    });
    return res;
  }

  UpdateInventoryTime(bucket, formobj, fromPopup: boolean, InventoryId: number) {

    const callreference = localStorage.getItem('callReference');
    const highPriority = sessionStorage.getItem('highPriporityAccount');
    console.log('UpdateInventoryTime : ', callreference, highPriority)
    if (highPriority != null || callreference != null) {
      console.log('IN Else UpdateInventoryTime : ', bucket);
      this.MapInventoryLogId(bucket.Name);
      this.GetAllFieldsApiCall(bucket, InventoryId, fromPopup);
      return true;
    }

    this.Deallocated = false;
    this.agentservice.UpdateInventoryTime(formobj).subscribe(
      res => {
        this.InventoryLogId = res.json().Data
        this.MapInventoryLogId(bucket.Name);
        this.GetAllFieldsApiCall(bucket, InventoryId, fromPopup);
      },
      err => {
        if (err.status == 403) {
          this.OpenAccountsModal = false;
          this.DisplayMain = false;
          this.DisplayMessage = "This Account is already allocated to other agent";
          this.RemoveAccountFromLocal();
          this.InventoryId = 0;
          this.InventoryLogId = 0;
          this.GetBucketsWithCount();
          this.Deallocated = true;
        }
        this.ResponseHelper.GetFaliureResponse(err);
      }
    );
  }

  MapInventoryLogId(bucketname) {
    this.LocalAccounts = sessionStorage.getItem("Accounts") ? JSON.parse(sessionStorage.getItem("Accounts")) : [];
    this.LocalAccounts.forEach(e => {
      if (e.Inventory_Id == this.InventoryId && e.Bucket_Name == bucketname && e.Processed != 'Complete') {
        if (e.Inventory_Log_Id == null) {
          e.Inventory_Log_Id = this.InventoryLogId;
        }
      }
    });
    sessionStorage.setItem("Accounts", JSON.stringify(this.LocalAccounts));
  }


  ManageNullFields() {
    this.AllFields.forEach(e => {
      // console.log('label value ', e.FieldValue, e.Display_Name)
      if (e.Display_Name.indexOf('Payer') != -1) {
        this.CurrentPayerName = e.FieldValue;
      }
      if (e.Is_Standard_Field == true) {
        switch (e.Column_Datatype) {
          case "Text":
            // if (e.FieldValue == null) {
            //   e.FieldValue = "NA"
            // }
            if (e.Display_Name.indexOf('Payer') != -1) {
              this.InsurancePayerName = e.FieldValue;
            }
            break;
          case "Date":
            // if (e.FieldValue != null) {
            //   var d = new Date(e.FieldValue);
            //   e.FieldValue = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear()
            // }
            // else {
            // var d = new Date(e.FieldValue).toISOString();
            // }
            e.FieldValue = e.FieldValue != null ? new Date(e.FieldValue).toISOString() : new Date().toISOString();
            // else {
            //   e.FieldValue = "NA"
            // }
            break;
        }
      }
      else {
        switch (e.Column_Datatype) {
          case "Text":
            // if (e.FieldValue == null || e.FieldValue == "") {
            //   e.FieldValue = "NA"
            // }
            if (e.Is_Dropdown_Field && e.Is_View_Allowed_Agent && e.Is_Edit_Allowed_Agent) {
              var dropdownlist = [];
              this.dropdownservice.getDropdownValue(this.ClientId, e.Id).subscribe(
                res => {
                  dropdownlist = res.json().Data;
                  e.DropdownList = dropdownlist
                },
                err => {
                  // this.ResponseHelper.GetFaliureResponse(err);
                }
              )
            }
            break;

          case "Date":
            if (!e.Is_Edit_Allowed_Agent && e.Is_View_Allowed_Agent) {
              if (e.FieldValue != null) {
                var d = new Date(e.FieldValue);
                e.FieldValue = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear()
              }
              else {
                e.FieldValue = e.FieldValue != null ? new Date(e.FieldValue).toISOString() : new Date().toISOString();
              }
            }
            break;
        }
      }
    })
  }

  GetDenialCodeList = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      tap(() => {
        // this.searching = true
      }),
      switchMap(term => this.GetDenialCodeApi(term)),
      tap((res) => {
        if (res) { }
        // console.log(res)
        // this.searching = false
      })
    )

  GetNPIList = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      tap(() => {
        // this.searching = true
      }),
      switchMap(term => this.GetNPIApi(term)),
      tap((res) => {
        if (res) { }
        // console.log(res)
        // this.searching = false
      })
    )

  GetNPIApi(term) {
    if (term.length >= 3 && term) {
      return this.agentservice.GetAllNPIList(this.ClientId, term).pipe(
        tap(() => {
          // this.searchFailed = false
        }),
        catchError(() => {
          // this.searchFailed = true;
          return of([]);
        }))
    }
    return of([]);
  }

  GetDenialCodeApi(term) {
    if (term.length >= 3 && term) {
      return this.agentservice.GetAllDenialCode(this.ClientId, term).pipe(
        tap(() => {
          // this.searchFailed = false
        }),
        catchError(() => {
          // this.searchFailed = true;
          return of([]);
        }))
    }
    return of([]);
  }

  ToggleAppealModal(type) {
    if (type) {
      this.AppealType = type;

      this.CheckUploadedTemplate();
      return;
    }
    this.DisplayAppeal = !this.DisplayAppeal;
  }

  CheckUploadedTemplate() {
    this.agentservice.CheckUploadedTemplate(this.ClientId, this.CurrentPayerName).subscribe(
      res => {
        this.CheckTemplates = res.json().Data;
        this.Insurance_Id = res.json().Data[0].Insurance_Id;
        // console.log(res.json());
        this.DisplayAppeal = !this.DisplayAppeal;
        // this.ResponseHelper.GetSuccessResponse(res);
      },
      err => {
        this.CheckTemplates = [];
        this.AppealType = '';
        this.ResponseHelper.GetFaliureResponse(err);
      }
    );
  }

  DownloadReferenceFile() {
    this.AllFields.forEach(e => {
      if (e.Display_Name == "Reference_File_Name") {
        this.commonservice.GetReferenceFile(e.FieldValue).pipe(finalize(() => {
          // this.DisableDownload = false;
        })).subscribe(
          (res: any) => {
            var url = window.URL.createObjectURL(res.data);
            var a = document.createElement('a');
            document.body.appendChild(a);
            a.setAttribute('style', 'display: none');
            a.href = url;
            a.download = e.FieldValue;
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
          },
          err => {
            if (err.status == 400) {
              this.notificationservice.ChangeNotification([{ Message: "File not Found or Deleted", Type: "ERROR" }])
            }
            else {
              this.ResponseHelper.GetFaliureResponse(err);
            }

          }
        )
      }
    })
  }

  ViewCommentHistory() {
    this.agentservice.ViewCommentHistory(this.ClientId, this.InventoryId).subscribe(
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


  EndCurrentAccount() {
    if (this.InventoryLogId != 0) {
      var formobj = {
        Client_Id: this.ClientId,
        Inventory_Log_Id: this.InventoryLogId
      }
      this.agentservice.InsertEndTimeOfInventory(formobj).subscribe(
        res => {
        },
        err => {
          this.ResponseHelper.GetFaliureResponse(err);
        }
      );
    }
  }

  showBCBS() {
    this.DisplayBcbs = true
  }
  ToggleBcbsModal(event) {
    this.DisplayBcbs = !this.DisplayBcbs;
  }



  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    // event.returnValue = false;
    this.EndCurrentAccount();
  }

  getBCBSAssistance() {
    this.agentservice.getBCBSAssistance().subscribe(res => {
      let data = res.json()
      this.BCBAssistance = data.Data


    }, err => {
      this.ResponseHelper.GetFaliureResponse(err);
    })
  }

  toggleClientUserModal() {
    this.clientUserModal = !this.clientUserModal;
    console.log('toggleClientUserModal this.clientUserModal : ', this.clientUserModal)
  }

  hideClientUserMapping(event) {
    if (event == false) {
      this.clientUserModal = false;
    }

  }
  getButtonStatus() {
    this.agentservice.checkClientUserMappingButtonStatus().subscribe((response: any) => {
      console.log('response : ', response);
      if (response && response.Data) {
        if (response.Data[0] && response.Data[0].setVisible) {

          this.enableClientUserMapping = response.Data[0].setVisible.toLowerCase();
        }
      }
    }, (error) => {
      console.log('error : ', error);
      this.enableClientUserMapping = null;
    });
  }

  openUtilityPopup() {
    console.log('openUtilityPopup() : ', this.showHighPriorityAccounts);
    this.showHighPriorityAccounts = true;
  }
  closeHighPriorityAccountModal(event) {
    console.log('showHighPriorityAccounts : ', event, this.showHighPriorityAccounts);
    this.showHighPriorityAccounts = false;
  }

  openCallReferenceAccounts() {
    console.log('Old_Inventory_Log_Id : ', this.InventoryLogId);
    this.callreferenceAcccounts = true;
  }
  closeCallReferenceModal(event) {
    console.log('closeCallReferenceModal : ', event);
    this.callreferenceAcccounts = false;
  }
  callreferenceLog(data) {
    console.log('callreferenceLog : ', data);
    this.GetAllFields({}, data, true);
    this.closeCallReferenceModal(null);
  }

  highPriorityLog(data) {
    // data.Bucket_Name = "Special_Queue";
    console.log('highPriorityLog response : ', data, this.ActiveBucket);
    this.GetAllFields({}, data, true);
    this.closeHighPriorityAccountModal(null);
  }

  openCallReferenceInfo(field) {
    console.log('openCallReferenceInfo() : ', this.showCallReferenceInfo);
    this.CallReference_No = field.FieldValue;
    this.showCallReferenceInfo = true;
  }
  hideCallReferenceInfo() {
    console.log('hideCallReferenceInfo() : ', this.showCallReferenceInfo);
    this.showCallReferenceInfo = false;
  }
  openLinkForCall() {
    window.open('https://ap2.pulsework360.com/', '_blank');
  }

  addNewLine() {
    console.log('addNewLine() : ', this.AllFields);
    this.Is_New_Line = true;
    console.log('add New line : ', this.ClientId, this.InventoryId, this.InventoryLogId, this.ActiveBucket);
    this.agentservice.addNewLine(this.ClientId, this.InventoryId, this.InventoryLogId, this.ActiveBucket).subscribe((response) => {
      console.log('addNewLine response : ', response);
      this.AllFields = response.Data;
      this.setFieldsEditable();
      response.Message[0] = { Message: "Add New Line.", Type: "SUCCESS" }
      this.ResponseHelper.GetSuccessResponse(response)
    }, (error) => {
      console.log('error : ', error);
      // this.notificationservice.
      this.Is_New_Line = false;
      this.ResponseHelper.GetFaliureResponse(error);
    });
  }
  setFieldsEditable() {
    this.AllFields.forEach(field => {
      if (field.Is_Standard_Field == true)
        field.editableInput = true;
    });
    this.ManageNullFields();
  }

  submitAddNewLine(body) {
    // this.Is_New_Line=
    console.log('submitAddNewLine : ', JSON.stringify(body));
    this.agentservice.submitAddNewLine(body).subscribe((response) => {
      console.log('response : ', response)
      this.GetBucketsWithCount();
      this.DisableSubmit = false;
      this.ClearForm();
      // this.MarkLocalAccountComplete();
      this.AssignNextInventory();
      if (this.ActiveBucket.indexOf('Appeal') != -1) {
        this.ClearPdfStorage();
      }
      this.ResponseHelper.GetSuccessResponse(response);
    }, (error) => {
      console.log('error : ', error);
      this.DisableSubmit = false;
      this.ResponseHelper.GetFaliureResponse(error);
    })
  }
  dateTimeChange(event, field) {
    console.log('dateTimeChange : ', event, field);
  }

  openAddPCNModal() {
    this.inventoryDetails = {}
    this.inventoryDetails['Client_Id'] = this.ClientId;
    this.inventoryDetails['Inventory_Id'] = this.InventoryId;
    this.inventoryDetails['Inventory_Log_Id'] = this.InventoryLogId;
    // this.inventoryDetails['Notes'] = this.ActionForm.controls['Notes'].value;
    // console.log('Before this.AllFields : ', this.AllFields);
    this.AllFields.forEach(e => {
      // console.log('loop ele : ', e.Header_Name, e);
      if (e.Column_Datatype == 'Date') {
        if (e && e.FieldValue != null) {
          this.inventoryDetails[e.Display_Name] = moment(e.FieldValue).utcOffset(0, true).format();
        }
        else {
          this.inventoryDetails[e.Display_Name] = moment().utcOffset(0, true).format();
        }
      }
      else {
        this.inventoryDetails[e.Display_Name] = e.FieldValue;
      }
    });
    console.log('openAddPCNModal objs :', this.inventoryDetails)
    this.showAddPCNModal = true;
  }
  closeAddPCNModal() {
    console.log('showAddPCNModal :', this.showAddPCNModal);
    this.showAddPCNModal = false;
    var lastPCN: any = sessionStorage.getItem('lastPCN');
    lastPCN = lastPCN ? JSON.parse(lastPCN) : {}
    console.log('lastPCN : ', lastPCN);
    this.setActionFormFields(lastPCN);
    // this.ActionForm.patchValue({ "Status": lastPCN.Status });
    // this.OnStatusChange(lastPCN);
    // this.ActionForm.patchValue({ "SubStatus": lastPCN.Sub_Status });
    // this.OnSubStatusChange(lastPCN);
    // this.ActionForm.patchValue({ ActionCode: lastPCN.Action_Code });
  }

  setActionFormFields(lastPCN) {
    // Set Status
    this.ActionForm.patchValue({ "Status": lastPCN.Status });
    // SET Sub_Status
    const subStatusList = this.SaagLookup.filter((saag) => {
      if (saag.Status == lastPCN.Status) {
        return saag.Sub_Status;
      }
    });
    this.SubStatus = _.map(subStatusList, 'Sub_Status');
    this.ActionForm.patchValue({ SubStatus: lastPCN.Sub_Status });
    // SET Action_Code
    const actionCodeList = this.SaagLookup.filter((saag) => {
      if (saag.Sub_Status == lastPCN.Sub_Status) {
        return saag.Action_Code;
      }
    });
    this.ActionCode = _.map(actionCodeList, 'Action_Code');
    this.ActionForm.patchValue({ ActionCode: lastPCN.Action_Code });
    // console.log('setActionFormFields : ', this.ActionForm.value, this.SubStatus, this.ActionCode);
  }

  // concluder section
  setStatus() {
    this.saagservice.getSaagLookup(this.ClientId).subscribe((response: any) => {
      console.log('getSaagLookup : ', response);
      this.SaagLookup = response.json().Data.SAAG_Lookup;;
      this.Status = this.SaagLookup.map(function (obj) { return obj.Status; });
      this.Status = _.uniq(this.Status);
      console.log('setStatus : ', this.Status, this.SaagLookup);
    }, (error) => {
      console.log('error : ', error)
    })
  }

  submitConclusion(obj) {
    console.log('submitConclusion(obj): ', obj);
    obj.Fields['Concluder_Id'] = this.concluderId;
    obj.Fields["PCn_ids"] = obj.Fields["PCn_ids"] ? obj.Fields["PCn_ids"] : [];
    this.concluderService.saveConclusionData(obj).subscribe((response) => {
      console.log('saveConclusionData response : ', response);
      this.ResponseHelper.GetSuccessResponse(response);
      this.assigNextConclusionInventory();
      this.ActionForm.patchValue({ Status: '', SubStatus: '', ActionCode: '', WorkStatus: '', Notes: '' });
      this.Validated = false;
      this.DisableSubmit = false;
    }, (error) => {
      this.Validated = false;
      this.DisableSubmit = false;
      this.ResponseHelper.GetFaliureResponse(error);
      this.ActionForm.patchValue({ Status: '', SubStatus: '', ActionCode: '', WorkStatus: '', Notes: '' });
      console.log('error Messages : ', error);
      const httpResponse = error.json();
      console.log('httpResponse : ', httpResponse);
      if (httpResponse && httpResponse.Message[0]) {
        if (httpResponse.Message[0].Message == 'Unique Key already exists.') {
          this.assigNextConclusionInventory();
        }
      }
      console.log('saveConclusionData response : ', error);

    });
    // this.assigNextConclusionInventory();
  }

  assigNextConclusionInventory() {
    const localStr = sessionStorage.getItem('concluderAccounts');//JSON.parse(sessionStorage.getItem('concluderAccounts'));
    // let fieldList = [];
    if (localStr != null) {
      var concluderAccouts = JSON.parse(localStr);
      console.log('assigNextConclusionInventory before concluderAccouts : ', concluderAccouts.length);
      concluderAccouts.forEach((list, listIndex) => {
        list.forEach((field, index) => {
          field.FieldValue = field.Field_Value;
          console.log('assigNextConclusionInventory field : ', field.Header_Name, field.FieldValue, this.concluderId);
          if (field.Header_Name == 'Concluder_Id' && this.concluderId == field.FieldValue) {
            // fieldList = list;
            concluderAccouts.splice(listIndex, 1);
            return false;
          }
        });
      });
    }
    console.log('assigNextConclusionInventory After concluderAccouts : ', concluderAccouts.length);
    if (concluderAccouts && concluderAccouts.length > 0) {
      concluderAccouts[0].forEach((field) => {
        if (field.Header_Name == 'Concluder_Id' || field.Header_Name == 'Bucket_Id' || field.Header_Name == 'Allocated_To' || field.Header_Name == 'Allocated_On') {
          field.Is_Standard_Field = false;
        }
        else {
          field.Is_Standard_Field = true;
        }
        field.Is_Standard_Field = true;
        field['Display_Name'] = field.Header_Name;
        field['Is_View_Allowed_Agent'] = true;
        field['FieldValue'] = field.Field_Value;
      });
      const matchedObj = concluderAccouts[0].find((ele) => {
        return ele.Header_Name == "Concluder_Id";
      });
      // console.log('this.concluderId, matchedObj.FieldValue : ', this.concluderId, matchedObj.FieldValue)
      this.concluderService.getConclusionDataByConcludeID(this.ClientId, matchedObj.FieldValue, this.ActiveBucket).subscribe((response) => {
        // console.log('getConclusionDataByConcludeID response : ', response);
        this.setConcluderFields({ Bucket_Name: "Concluded", concluderId: matchedObj.FieldValue, fields: response.Data, closePopup: false });
      }, (error) => {
        // console.log('getConclusionDataByConcludeID error : ', error);
      })
      // this.setConcluderFields({ Bucket_Name: "Concluded", concluderId: matchedObj.FieldValue, fields: concluderAccouts[0], closePopup: false });
    }
    else {
      this.setConcluderFields({ Bucket_Name: "Concluded", concluderId: null, fields: [], closePopup: false });
    }
    sessionStorage.setItem('concluderAccounts', JSON.stringify(concluderAccouts));
  }

  setConcluderFields(event) {
    if (event) {
      event.fields.forEach(element => {
        // element.Is_Edit_Allowed_Agent = true;
        element['Is_View_Allowed_Agent'] = true;
      });
      this.AllFields = JSON.parse(JSON.stringify(event.fields));
      this.DisplayMain = true;
      this.ActiveBucket = event.Bucket_Name;
      this.concluderId = event.concluderId;
    }
    // if (event.closePopup == true) {
    //   this.openToBeConcludedBucketModal = false;
    // }

    if (this.AllFields && this.AllFields.length == 0) {
      this.DisplayMain = false;
      this.DisplayMessage = "Please click on Bucket to continue";
      this.ActiveBucket = '';
      this.concluderId = null;
      this.activeReasonBucket = null;
    }
    this.GetBucketsWithCount();
  }

  closeInstructionModal(event) {
    console.log('closeInstructionModal event : ', event);
    this.clientInstructionInfoModal = false;
    this.showClientUpdate();
  }

  openProjectAndPriorityModal() {
    this.projectandpriorityService.showProjectModal = true;
  }
  closeProjectAndPriorityModal() {
    this.projectandpriorityService.showProjectModal = true;
  }
  PNPAccountClick(event) {
    console.log('PNPAccountClick(event) data : ', event);
    // this.activePNPBucket = "PNP";
    // sessionStorage.removeItem('conclusionBucket'); //commented now
    this.ActionForm.patchValue({ Status: '', SubStatus: '', ActionCode: '', WorkStatus: '', Notes: '' });
    this.DisableSubmit = false;
    this.Validated = false;

    if (event) {
      this.AllFields = JSON.parse(JSON.stringify(event.AccountsList));
      this.DisplayMain = true;
      this.ActiveBucket = "PNP";
      this.PNP_Inventory_Id = event.PNP_Inventory_Id;
      this.PNP_Inventory_Log_Id = event.PNP_Inventory_Log_Id;
      this.activeReasonBucket = event.activeReasonBucket;
      // this.concluderId = event.concluderId; //commented now
    }
    if (event.closePopup == true) {
      // this.openToBeConcludedBucketModal = false; //commented now
      this.projectandpriorityService.showProjectModal = false;
    }
    if (this.AllFields && this.AllFields.length == 0) {
      this.DisplayMain = false;
      this.DisplayMessage = "Please click on Bucket to continue";
      this.ActiveBucket = '';
      this.activeReasonBucket = '';
    }
  }

  openEOBPDF() {
    const url = 'file://172.18.0.183/Share%20Temp/Rahul%2036728/EOB_PDF.pdf'
    window.open(url, '_blank');
  }
}
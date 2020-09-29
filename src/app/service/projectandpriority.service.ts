import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Token } from '../manager/token';
import 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class ProjectandpriorityService {

  TokenCls;
  showProjectModal = false;
  constructor(private http: Http, private router: Router) {
    this.TokenCls = new Token(this.router);
  }
  getProjectList(client_Id, Employee_Code) {
    //  api/inventory-data-upload-download-template/client/{id}
    return this.http.post(environment.ApiUrl + `api/PNP_Inventory_Bucket_Count_Controller`, {
      "Client_Id": client_Id,
      "Employee_Code": Employee_Code
    }, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) }).map(res => res.json());
  }

  getAccountsByProject(client_Id, projectName) {
    //  api/inventory-data-upload-download-template/client/{id}
    return this.http.get(environment.ApiUrl + `api/agent-pnp-account/${client_Id}?project_name=${projectName}`, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) }).map(res => res.json());
  }

  getPNPFields(client_Id, inventory_Id, inventory_Log_Id, projectName) {
    if (inventory_Log_Id == "N/A") {
      inventory_Log_Id = 0;
    }
    return this.http.get(environment.ApiUrl + `api/agent-pnp-fields/${client_Id}/${inventory_Id}/${inventory_Log_Id}?bucket_Name=${projectName}`, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) }).map(res => res.json());
    // api/agent-fields-PNP/{client_Id}/{inventory_Id}/{inventory_Log_Id}
  }

  updatePNPTime(Client_Id, PNP_Inventory_Id, PNP_Inventory_Log_Id) {
    const formObj = {
      "Client_Id": Client_Id,
      "Bucket_Name": "PNP",
      "PNP_Inventory_Id": PNP_Inventory_Id,
      "Old_PNP_Inventory_Log_Id": PNP_Inventory_Log_Id,
      "Insert_Log": true
    }
    return this.http.put(environment.ApiUrl + '/api/agent-pnp-time', formObj, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) }).map(res => res.json());
  }

  setLocalAccount(accountList) {
    sessionStorage.setItem('pnpAccounts', accountList);
  }
  removeLocalAccount() {
    sessionStorage.removeItem('pnpAccounts');
  }
}

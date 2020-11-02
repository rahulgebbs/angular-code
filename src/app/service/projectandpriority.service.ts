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
  getLocalAccount() {
    const result = sessionStorage.getItem('pnpAccounts');
    if (result != undefined && result.length > 0) {
      return JSON.parse(result);
    }
    return [];
  }

  setLocalAccount(accountList) {
    sessionStorage.setItem('pnpAccounts', JSON.stringify(accountList));
  }

  removeLocalAccount() {
    sessionStorage.removeItem('pnpAccounts');
  }

  submitPNPForm(formObj) {
    // /api/agent-pnp-fields
    return this.http.put(environment.ApiUrl + '/api/agent-pnp-fields', formObj, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) }).map(res => res.json());
  }

  getClientProjectList(client_Id) {
    return this.http.get(environment.ApiUrl + `/api/PNP_Module_Name/${client_Id}`, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) }).map(res => res.json());
  }
  addProject(formObj) {
    // /api/agent-pnp-fields
    return this.http.post(environment.ApiUrl + '/api/PNP_Module_Name', formObj, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) }).map(res => res.json());
  }

  deActivateProject(formObj) {
    // /api/agent-pnp-fields
    return this.http.put(environment.ApiUrl + '/api/PNP_Module_Name_Deactive', formObj, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) }).map(res => res.json());
  }

  getEmployeesByModule(Client_Id) {
    return this.http.get(environment.ApiUrl + `/api/get-Project-employee/${Client_Id}`, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) }).map(res => res.json());
  }

  getModulesByEmployee(Client_Id) {
    return this.http.get(environment.ApiUrl + `/api/get-employee-Project/${Client_Id}`, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) }).map(res => res.json());
  }
  deAllocateByAgent(formBody) {
    return this.http.put(environment.ApiUrl + `/api/pnp-deallocate-by-agent`, formBody, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) }).map(res => res.json());
  }

  deAllocateByModule(formBody) {
    return this.http.put(environment.ApiUrl + `/api/pnp-deallocate-by-project`, formBody, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) }).map(res => res.json());
  }
}

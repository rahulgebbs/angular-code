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
  // projectAndPriorityUpload(formBody) {
  //   return this.http.post(environment.FileApiUrl + '/api/PNP-inventory-data-upload', formBody, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  // }
}

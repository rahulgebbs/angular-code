import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Token } from '../manager/token';
import 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class DataUploadService {
  TokenCls;
  constructor(private http: Http, private router: Router) {
    this.TokenCls = new Token(this.router);
  }

  InventoryDataUpload(dataobj): any {
    return this.http.post(environment.FileApiUrl + '/api/inventory-data-upload', dataobj, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }
  ConcluderDataUpload(dataobj): any {
    return this.http.post(environment.ApiUrl + '/api/Upload_Concluder_Inventory', dataobj, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

  downloadInventoryTemplate(id) {
    //  api/inventory-data-upload-download-template/client/{id}
    return this.http.get(environment.ApiUrl + '/api/inventory-data-upload-download-template/client/' + id, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) }).map(res => res.json());
  }

  getModuleList(client_id) {
    return this.http.get(environment.ApiUrl + `/api/PNP_Module_Name/${client_id}`, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) }).map(res => res.json());
  }
  getEmployeeList(id) {
    return this.http.get(environment.ApiUrl + `/api/PNP-Inventory-Data-Employee/client/${id}`, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) }).map(res => res.json());
  }

  // PNP-inventory-data-upload

  projectAndPriorityUpload(formBody) {
    return this.http.post(environment.FileApiUrl + '/api/PNP-inventory-data-upload', formBody, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }
}

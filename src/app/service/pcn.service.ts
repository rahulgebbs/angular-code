import { Injectable } from '@angular/core';
import { Http, Headers, ResponseContentType } from '@angular/http';
import { Token } from '../manager/token';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

import 'rxjs/Rx';
import { environment } from 'src/environments/environment';
// import { environment } from 'src/environments/environment.prod';
// environment
@Injectable({
  providedIn: 'root'
})
export class PcnService {

  TokenCls

  constructor(private http: Http, private router: Router) {
    this.TokenCls = new Token(this.router);
  }

  getPCNList(Client_Id) {
    let headers: any = new Headers({
      'Access_Token': this.TokenCls.GetToken()
    });
    // http://172.30.52.25:1001/api/Get_Pcn_Configuration_Data?Client_Id=3035

    return this.http.get(environment.ApiUrl + '/api/Get_Pcn_Configuration_Data?Client_Id=' + Client_Id, { headers: headers }).map(res => res.json());
  }

  updatePCNList(body) {
    let headers: any = new Headers({
      'Access_Token': this.TokenCls.GetToken()
    });
    // http://172.30.52.25:1001/api/Get_Pcn_Configuration_Data?Client_Id=3035

    return this.http.post(environment.ApiUrl + '/api/Upload_PCN_Configuration', body, { headers: headers })
  }

  savePCN(body) {
    // Insert_PCN_Data
    let headers: any = new Headers({
      'Access_Token': this.TokenCls.GetToken()
    });
    // http://172.30.52.25:1001/api/Get_Pcn_Configuration_Data?Client_Id=3035

    return this.http.post(environment.ApiUrl + '/api/Insert_PCN_Data', body, { headers: headers }).map(res => res.json());
  }

  getPCNForInventory(Client_Id, inventoryId, Inventory_Log_Id) {
    let headers: any = new Headers({
      'Access_Token': this.TokenCls.GetToken()
    });
    return this.http.get(environment.ApiUrl + `/api/Get_PCN_Agent_Fields?id=${Client_Id}&inventoryId=${inventoryId}&Inventory_Log_Id=${Inventory_Log_Id}`, { headers: headers }).map(res => res.json());
  }

  checkIfPCNExist(Client_Id, PCN_Number, InventoryId, userId) {
    let headers: any = new Headers({
      'Access_Token': this.TokenCls.GetToken()
    });
    return this.http.get(environment.ApiUrl + `/api/Check_Is_PCN_No_Exist?id=${userId}&inventoryId=${InventoryId}&PCNNO=${PCN_Number}&ClientId=${Client_Id}`, { headers: headers }).map(res => res.json());
  }

  getAllocatedCount(Client_Id) {
    // http://localhost:63482/api/concluder-dashboard-allocated-count/client/9086
    let headers: any = new Headers({
      'Access_Token': this.TokenCls.GetToken()
    });
    return this.http.get(environment.ApiUrl + `/api/concluder-dashboard-allocated-count/client/${Client_Id}`, { headers: headers }).map(res => res.json());
  }

  getConcluderDashboard(Client_Id) {
    let headers: any = new Headers({
      'Access_Token': this.TokenCls.GetToken()
    });
    return this.http.get(environment.ApiUrl + `/api/concluder-dashboard/client/${Client_Id}`, { headers: headers }).map(res => res.json());
  }

  GetReport(formbody): any {
    return this.http.post(environment.ApiUrl + '/api/simple-report', formbody, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

  GetReportDownload(formbody): any {
    return this.http.post(environment.ApiUrl + '/api/PCN_Simple_Report', formbody, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }), responseType: ResponseContentType.Blob })
      .pipe(map(res => {
        console.log('in pipe res : ', res);
        return {
          filename: 'PCNReport.xlsx',
          data: res.blob()
        };
      }));
  }
}

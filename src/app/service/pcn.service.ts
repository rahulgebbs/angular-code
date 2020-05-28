import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
// import { environment } from '../../../environments/environment';
import { Token } from '../manager/token';
import { Router } from '@angular/router';

import 'rxjs/Rx';
import { environment } from 'src/environments/environment.prod';
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
}

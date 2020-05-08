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

    return this.http.get(environment.ApiUrl + '/api/Get_Pcn_Configuration_Data?Client_Id=' + Client_Id, { headers: headers })
  }

  updatePCNList(body) {
    let headers: any = new Headers({
      'Access_Token': this.TokenCls.GetToken()
    });
    // http://172.30.52.25:1001/api/Get_Pcn_Configuration_Data?Client_Id=3035

    return this.http.post(environment.ApiUrl + '/api/Upload_PCN_Configuration', body, { headers: headers })
  }
}
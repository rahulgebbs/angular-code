import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router } from '@angular/router';
// import { Token } from '../manager/token';
import 'rxjs/Rx';
import { Token } from './manager/token';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConcluderInboxMappingService {
  TokenCls;
  constructor(private http: Http, private router: Router) {
    this.TokenCls = new Token(this.router);
  }

  getConcluderUserListByCLientID(ClientID) {
    let headers: any = new Headers({
      'Access_Token': this.TokenCls.GetToken()
    });
    return this.http.get(environment.ApiUrl + `api/concluder-inbox-mapping-agents/${ClientID}`, { headers: headers })
      .map(res => res.json());
  }

  getConcluderCategoryListByCLientID(ClientID) {
    let headers: any = new Headers({
      'Access_Token': this.TokenCls.GetToken()
    });
    return this.http.get(environment.ApiUrl + `api/get-category/${ClientID}`, { headers: headers })
      .map(res => res.json());
  }

  getQueueList(ClientID, categoryName) {
    let headers: any = new Headers({
      'Access_Token': this.TokenCls.GetToken()
    });
    return this.http.get(environment.ApiUrl + `api/get-queue/${ClientID}?category=${categoryName}`, { headers: headers })
      .map(res => res.json());
  }
  getInboxList(ClientID, queueName) {
    let headers: any = new Headers({
      'Access_Token': this.TokenCls.GetToken()
    });
    return this.http.get(environment.ApiUrl + `api/get-inbox/${ClientID}?Queue=${queueName}`, { headers: headers })
      .map(res => res.json());
  }
  // updateClientUserMapping(accessToken, userObj) {
  //   let headers: any = new Headers({
  //     'Access_Token': accessToken
  //   });
  //   return this.http.put(environment.ApiUrl + '/api/Mapping_CRUD_', userObj, { headers: headers }).map(res => res.json());
  // }

  // deleteECNUser(activeUser, user, isActive) {
  //   let headers: any = new Headers({
  //     'Access_Token': activeUser.TokenValue
  //   });
  //   const body = {
  //     "modifiedBy": activeUser.UserId,
  //     "ClientUserMappingManagement_Id": user.ClientUserMappingManagement_Id,
  //     "isActive": isActive
  //   }
  //   return this.http.post(environment.ApiUrl + '/api/Delete_ClientUserMapping_Data_', body, { headers: headers })
  //     .map(res => res.json());
  // }

  // getECNInfo(accessToken, ECN) {
  //   let headers: any = new Headers({
  //     'Access_Token': accessToken
  //   });
  //   return this.http.get(environment.ApiUrl + '/api/Get_PopUp_Data/' + ECN, { headers: headers })
  //     .map(res => res.json());
  // }
}

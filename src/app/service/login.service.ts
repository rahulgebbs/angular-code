import { Injectable } from '@angular/core';
import { Token } from 'src/app/manager/token';
import { Http, Headers, ResponseContentType } from '@angular/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
// import { map } from 'rxjs/operators';
import * as jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  Token;
  hideGebbsLogo = false;
  TokenCls: Token = new Token(this.router);
  constructor(private http: Http, private router: Router) {
    // this.checkIfDomainIsForClient()
  }
  checkIfDomainIsForClient() {
    // const apiURL = environment.ApiUrl;
    // console.log('checkIfDomainIsForClient apiURL : ', apiURL);
    // if (apiURL === 'http://172.30.52.25:1001/') {
    //   this.hideGebbsLogo = true;
    // }
    // console.log('checkIfDomainIsForClient this.hideGebbsLogo : ',this.hideGebbsLogo);
  }
  Login(data: any) {
    return this.http.post(environment.ApiUrl + '/api/Login', data);
  }
  getQRCode(username) {
    return this.http.get(environment.ApiUrl + '/api/GetPair?Username=' + username).map(res => res.json());
  }

  matchOTP(passcode, userId, Email_Id) {
    return this.http.get(environment.ApiUrl + '/api/ValidatePair?pin=' + passcode + '&userid=' + userId + '&Email_Id=' + Email_Id).map(res => res.json());
  }

  getTimeout() {
    return this.http.get(environment.ApiUrl + '/api/session-timeout', { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) }).map(res => res.json());
    // session-timeout
  }
}

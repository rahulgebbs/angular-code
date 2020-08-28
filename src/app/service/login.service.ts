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
  TokenCls: Token = new Token(this.router);
  constructor(private http: Http, private router: Router) { }

  Login(data: any) {
    return this.http.post(environment.ApiUrl + '/api/Login', data);
  }
  getQRCode(username) {
    return this.http.get(environment.ApiUrl + '/api/GetPair?Username=' + username).map(res => res.json());
  }

  matchOTP(passcode, userId) {
    return this.http.get(environment.ApiUrl + '/api/ValidatePair?pin=' + passcode + '&userid=' + userId).map(res => res.json());
  }

  getTimeout() {
    return this.http.get(environment.ApiUrl + '/api/session-timeout', { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) }).map(res => res.json());
    // session-timeout
  }
}

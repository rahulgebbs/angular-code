import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
import { Token } from '../manager/token';
import { Router } from '@angular/router';
// import { map } from 'rxjs/operators';
// import { Observable } from 'rxjs';
import 'rxjs/Rx';
@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {
  TokenCls

  constructor(private http: Http, private router: Router) {
    this.TokenCls = new Token(this.router)
  }

  ChangePassword(formbody): any {
    return this.http.post(environment.ApiUrl + 'api/change-password', formbody, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

  ResetPasswrd(formbody) {
    return this.http.post(environment.ApiUrl + 'api/Password_Reset', formbody);
  }
}

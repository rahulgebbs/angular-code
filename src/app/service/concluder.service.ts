import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Token } from '../manager/token';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class ConcluderService {
  TokenCls
  constructor(private http: Http, private router: Router) {
    this.TokenCls = new Token(this.router);
}
  checkIfConcluder(clientId)
    {
        // api/Check_Concluder_Process
        let headers: any = new Headers({
            'Access_Token': this.TokenCls.GetToken()
        });
        console.log('addNewLine() service : ');
        return this.http.get(environment.ApiUrl + `/api/Check_Concluder_Process?Client_Id=${clientId}`, { headers: headers }).map(res => res.json());
    }

    getConcluderInventoryData()
    {
        // api/Get_Concluder_Inventory_data
        let headers: any = new Headers({
            'Access_Token': this.TokenCls.GetToken()
        });
        console.log('addNewLine() service : ');
        return this.http.get(environment.ApiUrl + `/api/Get_Concluder_Inventory_data`, { headers: headers }).map(res => res.json());
    }
}

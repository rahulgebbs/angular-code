import { Injectable } from '@angular/core';
import { Http, Headers, ResponseContentType } from '@angular/http';
import { Router } from '@angular/router';
import { Token } from '../manager/token';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class ClientApprovalService {
  TokenCls

  constructor(private http: Http, private router: Router) {
    this.TokenCls = new Token(this.router);
  }

  getPracticeNameList(ClientId) {
    // get-practice

    return this.http.get(environment.ApiUrl + `api/get-practice/${ClientId}`, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) }).map(res => res.json());
  }

  GetSummaryAndComments(ClientId: number, fromdate, todate, status, practice) {
    if (practice == null || practice.length == 0) {
      practice = 'All'
    }
    return this.http.get(environment.ApiUrl + '/api/client-approval/client/' + ClientId + '?FromDate=' + fromdate + '&ToDate=' + todate + '&Status=' + status + '&practice=' + practice, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

  GetAging(clientId, action, FromDate, ToDate, SelectedComment: string, practice) {
    if (practice == null || practice.length == 0) {
      practice = 'All'
    }
    return this.http.get(environment.ApiUrl + '/api/client-approval/client/' + clientId + '?status=' + action + '&FromDate=' + FromDate + '&ToDate=' + ToDate + '&comment=' + SelectedComment + '&practice=' + practice, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

  GetInventories(ClientId: number, Action: string, FromDate: string, ToDate: string, SelectedComment: string, Ageing_Bucket_Name: any, practice) {
    if (practice == null || practice.length == 0) {
      practice = 'All'
    }
    return this.http.get(environment.ApiUrl + '/api/client-approval/client/' + ClientId + '?status=' + Action + '&FromDate=' + FromDate + '&ToDate=' + ToDate + '&comment=' + SelectedComment + '&filter=' + Ageing_Bucket_Name + '&practice=' + practice, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

  SaveInventories(response) {
    return this.http.post(environment.ApiUrl + '/api/client-approval', response, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

  GetReferenceFile(filename: any) {
    return this.http.post(environment.FileApiUrl + '/api/approval-file-download', { Reference_File_Name: filename }, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }), responseType: ResponseContentType.Blob })
      .pipe(map(res => {
        return {
          filename: filename,
          data: res.blob()
        };
      }));

  }

  ViewCommentHistory(Client_Id: any, Inventory_Id: any) {
    return this.http.get(environment.ApiUrl + '/api/client-approval/client/' + Client_Id + '/' + Inventory_Id, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

  excelData(ClientId: number, fromdate, todate, status, practice) {
    if (practice == null || practice.length == 0) {
      practice = 'All'
    }
    return this.http.get(environment.ApiUrl + `/api/Get_Client_Assistance_Summary_Report?Id=${ClientId}&status=${status}&FromDate=${fromdate}&ToDate=${todate}&practice=${practice}`, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) }).map(res => res.json());;
  }

}

import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Token } from '../manager/token';
import 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class ConcluderService {
  TokenCls
  constructor(private http: Http, private router: Router) {
    this.TokenCls = new Token(this.router);
  }
  checkIfConcluder(clientId) {
    // api/Check_Concluder_Process
    let headers: any = new Headers({
      'Access_Token': this.TokenCls.GetToken()
    });
    console.log('checkIfConcluder() service : ');
    return this.http.get(environment.ApiUrl + `/api/Check_Concluder_Process?Client_Id=${clientId}`, { headers: headers }).map(res => res.json());
  }

  getConcluderInventoryData() {
    // api/Get_Concluder_Inventory_data
    let headers: any = new Headers({
      'Access_Token': this.TokenCls.GetToken()
    });
    console.log('getConcluderInventoryData() service : ');
    return this.http.get(environment.ApiUrl + `/api/Get_Concluder_Inventory_data`, { headers: headers }).map(res => res.json());
  }

  GetConcluderReport(formbody): any {
    return this.http.post(environment.ApiUrl + '/api/Concluder_Report', formbody, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

  insertConcluderTime(formbody) {
    return this.http.post(environment.ApiUrl + '/api/Insert_Concluder_Time_Management', formbody, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

  updateConcluderTime(formbody) {
    return this.http.put(environment.ApiUrl + '/api/Update_Concluder_Time_Management', formbody, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

  saveToBeConcluderData(formbody) {
    return this.http.post(environment.ApiUrl + '/api/Insert_Concluder_Details', formbody, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

  getDropDownStatus(clientId) {
    // Get_Concluder_Inventory_data
    return this.http.get(environment.ApiUrl + `/api/Get_Concluder_Details_Status?Client_Id=${clientId}`, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) }).map(res => res.json());
  }

  submitToBeConcludedForm(formbody) {
    // Get_Concluder_Inventory_data
    return this.http.post(environment.ApiUrl + `/api/Insert_Concluder_Details`, formbody, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) });
  }

  getConclusionDataByBucket(clientId, Employee_Code, Bucket_Name) {
    let headers: any = new Headers({
      'Access_Token': this.TokenCls.GetToken()
    });
    console.log('getConcludedBucketCount() service : ');

    return this.http.get(environment.ApiUrl + `/api/Get_Conclusion_Bucket_data?client_Id=${clientId}&Employee_Code=${Employee_Code}&Bucket_Name=${Bucket_Name}`, { headers: headers }).map(res => res.json());
  }

  getConcludedBucketCount(clientId) {
    // api/Get_Concluder_Inventory_data
    let headers: any = new Headers({
      'Access_Token': this.TokenCls.GetToken()
    });
    console.log('getConcludedBucketCount() service : ');
    // /api/Get_Conclusion_Bucket_data?client_Id=9064&Employee_Code=5000&Bucket_Name=Denials_Provider_Issue
    return this.http.get(environment.ApiUrl + `api/Get_Conclusion_Bucket_Count?client_Id=${clientId}`, { headers: headers }).map(res => res.json());
  }

  getConclusionDataByConcludeID(clientId, Concluder_ID, Bucket_Name) {
    // Get_Data_By_Concluder_Id
    let headers: any = new Headers({
      'Access_Token': this.TokenCls.GetToken()
    });
    return this.http.get(environment.ApiUrl + `api/Get_Data_By_Concluder_Id?client_Id=${clientId}&Concluder_ID=${Concluder_ID}&Bucket_Name=${Bucket_Name}`, { headers: headers }).map(res => res.json());
  }

  saveConclusionData(formBody) {
    // "http://localhost:63482/api/Insert_Concluder_INto_Inventory
    return this.http.post(environment.ApiUrl + `/api/Insert_Concluder_INto_Inventory`, formBody, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) }).map(res => res.json());;
  }

  getUnWorkedAccounts(clientId, employee_code, bucket_name) {
    let headers: any = new Headers({
      'Access_Token': this.TokenCls.GetToken()
    });
    return this.http.get(environment.ApiUrl + `/api/Get_Unworked_Account_By_Agent_And_Bucket_wise?id=${clientId}&employee_code=${employee_code}&bucket_name=${bucket_name}`, { headers: headers }).map(res => res.json());
  }

  getAllEmployeeByClient(clientId) {
    // api/Get_All_Employee_By_Client

    let headers: any = new Headers({
      'Access_Token': this.TokenCls.GetToken()
    });
    return this.http.get(environment.ApiUrl + `/api/Get_All_Employee_By_Client?id=${clientId}`, { headers: headers }).map(res => res.json());
  }
  // Update_Unworked_Account_By_Agent_And_Bucket_wise
  updateConclusionData(formBody) {
    // "http://localhost:63482/api/Insert_Concluder_INto_Inventory
    return this.http.put(environment.ApiUrl + `/api/Update_Unworked_Account_By_Agent_And_Bucket_wise`, formBody, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) }).map(res => res.json());
  }

  getEmployeesByBucket(clientId) {
    let headers: any = new Headers({
      'Access_Token': this.TokenCls.GetToken()
    });
    return this.http.get(environment.ApiUrl + `/api/get-buckets-employee?client_id=${clientId}`, { headers: headers }).map(res => res.json());
  }

  getBucketsByEmployee(clientId) {
    let headers: any = new Headers({
      'Access_Token': this.TokenCls.GetToken()
    });
    return this.http.get(environment.ApiUrl + `/api/get-employee-buckets?client_id=${clientId}`, { headers: headers }).map(res => res.json());
  }

  deAllocateCOncluder(formBody) {
    return this.http.post(environment.ApiUrl + `/api/deallocate-by-bucket`, formBody, { headers: new Headers({ 'Access_Token': this.TokenCls.GetToken() }) }).map(res => res.json());
  }
  // pnp-deallocate-by-agent
}


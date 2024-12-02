import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SupportBody } from 'src/models/support/body';
import { Body,Bodycalldet } from 'src/models/patientlist/body';
import { RegistrBody } from 'src/models/register/body';
import { UserService } from 'src/services/users_list/userlist.service';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  url : string;
  apptype = "WEB";
  token = "cGFydG5lcl9pZD00NjgzMDY1NCZzaWc9MzI0xYTRhZDY4ZDg5N2JiZjI10NDZiZXNzaW9uX2lkPTJfTVg0ME5qZ3pN";
  constructor(private http: HttpClient,
              private userService : UserService) { 
                this.userService.data$.subscribe(data => {
                  this.url = data;
                });
              }


  Patient_details_by_id(patdetid: number): Observable<Body>{
    let vltdataitem  = JSON.parse(sessionStorage.getItem('valitem'));   
    return this.http.post<Body>(`${this.url}patientdetbyid.php`, {patdetid: patdetid,token: vltdataitem.token ,apptype:this.apptype});
  }

  Patient_List(loginID : number, userrole : string): Observable<Body>{
    let jsonItem  = JSON.parse(sessionStorage.getItem('valitem'));
    return this.http.post<Body>(`${this.url}listpatientbylid.php`, {login_loginid: loginID, userrole : userrole, apptype:this.apptype,token:jsonItem.token});
  }

  Patient_LogList(): Observable<Bodycalldet>{
    return this.http.post<Bodycalldet>(`${this.url}patient/listpatient.php`, {login_loginid: 100,apptype:this.apptype,token:this.token});
  }

  Patient_UpdatecallLog(callperson:string,callnotes:string,patid:string): Observable<Bodycalldet>{
    return this.http.post<Bodycalldet>(`${this.url}patient/Updatecalllog.php`, {callperson:callperson,callnotes:callnotes,patid:patid,apptype:this.apptype,token:this.token});
  }
  
  Patient_List_srchstr(srchstr:string,userrole:string): Observable<Body>{
    return this.http.post<Body>(`${this.url}listpatientbystr.php`, {srchstr: srchstr,userrole:userrole});
  }

  UpdatePatientDetails(firstname: string, lastname: string,email:string,phone_no:string, dateofbirth:string, sex: string, preflang:string,state: string, city: string, postaladdress: string, heightft:number,heightin:number,weight:number,bloodgrp:string,knownallg:string, id: number,pattype:string,title:string,pincode:string): Observable<RegistrBody>{
    let jsonItem  = JSON.parse(sessionStorage.getItem('valitem'));
    return this.http.post<RegistrBody>(`${this.url}updatepatient.php`, {patdet_sex: sex,patdet_contact: phone_no, patdet_state: state, patdet_city: city, patdet_postadd: postaladdress, patdet_dob: dateofbirth,patdet_email: email, patdetid: id,patdet_preflang:preflang,patdet_ht_ft:heightft,patdet_ht_in:heightin,patdet_wt:weight,patdet_bg:bloodgrp,patdet_allergy:knownallg,patdet_title:title,patdet_pincode:pincode,token: jsonItem.token ,apptype:this.apptype});
  }


  public is4MBFileSize(event,i){
    if (event.target.files[i].size/1024/1024 > 4) {
      return true;
    }else{
      return false;
    }
  }
}

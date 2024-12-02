import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Body_doc} from 'src/models/docappoinments/body'
import { Observable } from 'rxjs';
import { RegistrBody,invBody } from 'src/models/register/body';
import {Body_lab} from 'src/models/patlabtest/body';
import { UserService } from 'src/services/users_list/userlist.service';

@Injectable({
  providedIn: 'root'
})
export class CalenderService {
  url : string;
  apptype = "WEB";
  token = "cGFydG5lcl9pZD00NjgzMDY1NCZzaWc9MzI0xYTRhZDY4ZDg5N2JiZjI10NDZiZXNzaW9uX2lkPTJfTVg0ME5qZ3pN";
  constructor(private http: HttpClient,
              private userService : UserService) { 
                this.userService.data$.subscribe(data => {
                  this.url = data;
                });
              }

  UpdateCalender(caldet_date: string, appid: number, caldetid: number,userrole : string,clinicID : number): Observable<RegistrBody>{
    return this.http.post<RegistrBody>(`${this.url}updatecalender.php`, {caldet_date: caldet_date, appid: appid, caldetid: caldetid, userrole : userrole, clinicID : clinicID});
  }

  ListPrescDetails(startdate: string, enddate: string,patsrcstr : number): Observable<Body_doc>{
    return this.http.post<Body_doc>(`${this.url}prescription/listprescdetails.php`, {startdate: startdate, enddate: enddate, patsrcstr : patsrcstr});
  }
  
  ListDoctorConsults(docdetid: number): Observable<Body_doc>{
    return this.http.post<Body_doc>(`${this.url}ledger/listconsults.php`, { docdet_docid: docdetid});
  }

  ListMonthlyConsults(docdetid: number, month : string, year : number): Observable<Body_doc>{
    return this.http.post<Body_doc>(`${this.url}ledger/listmonthlyconsults.php`, { docdet_docid: docdetid, month : month, year : year});
  }
  
  ListPatientLabtest(startdate: string, enddate: string, patstr:string): Observable<Body_lab>{
    return this.http.post<Body_lab>(`${this.url}listpatientlabtest.php`, {startdate: startdate, enddate: enddate, patstr: patstr});
  }

  mobDev(caldetid: number): Observable<Body_doc>{
    return this.http.post<Body_doc>(`${this.url}/device-det.php`,{devCaldetID: caldetid}); 
  }

  ListDoctorpatAppts(startdate: string, enddate: string, docdetid: number,patdetid:number,patsrcstr : number): Observable<Body_doc>{
    let jsonItem  = JSON.parse(sessionStorage.getItem('valitem'));  
    return this.http.post<Body_doc>(`${this.url}listpatientapphistory.php`, {startdate: startdate, enddate: enddate, docdet_docid: docdetid,patdet_patid:patdetid,patsrcstr : patsrcstr,apptype:this.apptype,token:jsonItem.token});
  }

  lab_orderCheck(fileID: string): Observable<Body_doc>{
    return this.http.post<Body_doc>(`${this.url}/labtest/OH-OrderStatus-API.php`,{fileID: fileID}); 
  }

  lab_orderCancel(fileID: string, cancellationExplanation : string): Observable<Body_doc>{
    return this.http.post<Body_doc>(`${this.url}/labtest/OH-Cancel-API.php`,{fileID: fileID, cancellationExplanation : cancellationExplanation}); 
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Body } from 'src/models/doctorlist/body';
import { BodyCat } from 'src/models/doctorlistcat/body';
import { Observable } from 'rxjs';
import { DocDetails_ResponseBody } from 'src/models/docdetails/body'
import { Docledger_ResponseBody} from  'src/models/docledger/body';
import { Datum } from 'src/models/doctorlist/datum';
import { vaultdata } from 'src/models/localstorage/vault';
import { filebody } from 'src/models/docfilelist/body';
import { UserService } from 'src/services/users_list/userlist.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  url : string;
  apptype = "WEB";
  token = "cGFydG5lcl9pZD00NjgzMDY1NCZzaWc9MzI0xYTRhZDY4ZDg5N2JiZjI10NDZiZXNzaW9uX2lkPTJfTVg0ME5qZ3pN";
  drName : string;
  drNameProfile : string;
  docdetail : string;
  sharedDataMsg : Datum;

  constructor(private http: HttpClient,private router: Router,private userService : UserService) { 
                this.userService.data$.subscribe(data => {
                  this.url = data;
                });
              }
    
  Doctor_List(srchstr: string): Observable<Body>{
    return this.http.post<Body>(`${this.url}doctor/selectalldoc.php`, {srchstr: srchstr, apptype:this.apptype,token:this.token});
  }

  Doctor_OnBoardList(docdetid : number): Observable<Body>{
    return this.http.post<Body>(`${this.url}doctor/selectOnboardList.php`, {docdetid : docdetid, apptype:this.apptype,token:this.token});
  }
  searchDoctor(srchstr: string): Observable<Body>{
    return this.http.post<Body>(`${this.url}doctor/searchAllDoctor.php`, {srchstr: srchstr,apptype:this.apptype,token:this.token});
  }

  Doctor_CatList(cat:string,city:string): Observable<BodyCat>{
    return this.http.post<BodyCat>(`${this.url}selAlldocbycat.php`, {cat:cat,city:city,apptype:this.apptype,token:this.token});
  }

  Doctor_details_by_id(loginid: string): Observable<DocDetails_ResponseBody>{
    return this.http.post<DocDetails_ResponseBody>(`${this.url}doctordetbylid.php`, {loginid: loginid});
}

  get_ledger_bydocid(docid:number,month : string, year : number): Observable<Docledger_ResponseBody>{
    return this.http.post<Docledger_ResponseBody>(`${this.url}ledger/listconsultsummary.php`,{docdet_docid:docid,month : month, year : year});
  }
  
  get_ledger_fordoc(docid:number): Observable<Docledger_ResponseBody>{
    return this.http.post<Docledger_ResponseBody>(`${this.url}ledger/listconsultdocsummary.php`,{docdet_docid:docid});
  }

  ledger_updateSumm(Grossamt_upd : number, Commission: number, TDS: number, NetValueinINR: number, PaymentDate_1: string, Payment_Amount_1: number,PaymentDate_2: string, Payment_Amount_2: number , consent :string, idDoctor_Consult_summary : number): Observable<Docledger_ResponseBody>{
    return this.http.post<Docledger_ResponseBody>(`${this.url}ledger/updateSummary.php`, {Grossamt_upd : Grossamt_upd, Commission: Commission, TDS: TDS, NetValueinINR: NetValueinINR, PaymentDate_1: PaymentDate_1, Payment_Amount_1: Payment_Amount_1,PaymentDate_2: PaymentDate_2, Payment_Amount_2: Payment_Amount_2 , consent :consent,idDoctor_Consult_summary : idDoctor_Consult_summary});
  }

  /* Getting doctor file details */
 docctorFilesByID(docdetid: number): Observable<filebody>{
    return this.http.post<filebody>(`${this.url}doctor/listDocFilesByID.php`, {docdetid : docdetid,token: this.token ,apptype:this.apptype});
  }

  Delete_docFile(docfileid : number,docdetid : number,docfilesrc : string): Observable<filebody>{
    return this.http.post<filebody>(`${this.url}s3FileUploads/deleteDocFile.php`, {docfileid:docfileid, docdetid : docdetid, docfilesrc : docfilesrc, token: this.token ,apptype:this.apptype});
  }

  /* View Profile option for the Doctors */
  onDoctorInfo(docdetail:Datum)
  {
    let content = sessionStorage.getItem('valitem');

    if(docdetail.docdet_lname=="" && !docdetail.docdet_mname){
      this.drName = docdetail.docdet_title.toLowerCase()+'-'+docdetail.docdet_fname.toLowerCase();

    }else if(docdetail.docdet_mname=="" || !docdetail.docdet_mname ){
      this.drName = docdetail.docdet_title.toLowerCase()+'-'+docdetail.docdet_fname.toLowerCase()+'-'+docdetail.docdet_lname.toLowerCase();

    }else{
      this.drName = docdetail.docdet_title.toLowerCase()+'-'+docdetail.docdet_fname.toLowerCase()+'-'+docdetail.docdet_mname.toLowerCase()+'-'+docdetail.docdet_lname.toLowerCase();

    }
    if(!content)
    {
      let vltdataitem =  new vaultdata;
      vltdataitem.docdetail = docdetail;
      vltdataitem.msg={message:"",msgboxtype:""}
      sessionStorage.setItem("valitem",JSON.stringify(vltdataitem));
      this.router.navigate([docdetail.docdet_cat,docdetail.docdet_loc,this.drName]);
    }
    else
    {
      let vltdataitem  = JSON.parse(sessionStorage.getItem('valitem'));
      vltdataitem.docdetail = docdetail;
      sessionStorage.setItem("valitem",JSON.stringify(vltdataitem));
      this.router.navigate([docdetail.docdet_cat,docdetail.docdet_loc,this.drName]);
    }
  }

  /* Book appointment button in Dr spl pages */
  onBookDocApp(docdetail:Datum):void
  {
    let content = sessionStorage.getItem('valitem');
    let doc = docdetail;
    sessionStorage.setItem("appdoc",JSON.stringify(doc));
    let frompage;
    if(doc.docdet_videocall =="N"){
      frompage = 'clinicapp';
    }else{
      frompage = 'videoapp';
    }
    sessionStorage.setItem("frompage",JSON.stringify(frompage));
    if(!content)
    {
      this.router.navigate(['/login']);
    }
    else
    {
      let vltdataitem  = JSON.parse(sessionStorage.getItem('valitem'));
      vltdataitem.docdetail = docdetail;
      sessionStorage.setItem("valitem",JSON.stringify(vltdataitem));
      if(!vltdataitem.patdetail )
      {
        this.router.navigate(['/login']);
      }
      else
      {
        this.router.navigate(['/book-appointment']);
      }
    }
  }


  getDrFees(vidFees : number, clinFees : number)
  {
    if (vidFees == 0)
    {
      return clinFees;
    }
    else
    {
      return vidFees;
    }
  }
  /* to pass values from one comp to another (unrelated components)  */

  setData(data: Datum) {
    this.sharedDataMsg = data;
  }

  getData() {
    return this.sharedDataMsg;
  }
}

import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/models/usermodel';
import { DoctorService } from 'src/services/doctor_details/doctor.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CalenderService } from 'src/services/calenderdetails/calender.service';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MsgdialogComponent } from 'src/app/msgdialog/msgdialog.component';
import { Doc_ledger_detail} from "src/models/docledger/datum";

@Component({
  selector: 'app-admin-ledger',
  templateUrl: './admin-ledger.component.html',
  styleUrls: ['./admin-ledger.component.css'],
  providers: [DatePipe]
})
export class AdminLedgerComponent implements OnInit {
  public doc_ledger_det:Doc_ledger_detail[];
  public paymentfrmgrp: FormGroup;
  public monthfrmgrp: FormGroup;
  public layout_consult = false;
  public layout_monthly = false;
  public layout_summary = false;
  public updPayVisible = true;
  selectedDoc:string;
  selectdocid:number;
  docdetail: Array<UserModel> = [];
  doclist;
  isLastDrListed : boolean = false;
  idDrSelected : boolean = false;
  MyDataConsults : any;
  MyMonthlyConsults : any;
  MyLedgerSummary:any;
  withConsent:boolean;
  showupdetail:any;
  datePipeEn: DatePipe = new DatePipe('en-US');
  PayDate_1 = new FormControl(new Date());
  PayDate_2 = new FormControl(new Date());
  PaymentDate_1 : string;
  PaymentDate_2 : string;
  isAdmin : boolean = false;

  public totalPaidTrans = 0;    
  public totalFollups = 0;
  public totalGross = 0;
  public totalNet = 0;
  private value;  

  callTypeDisp : string = "";

  monthlist: any[] = [
    { name: 'January' },
    { name: 'February' },
    { name: 'March' },
    { name: 'April' },
    { name: 'May' },
    { name: 'June' },
    { name: 'July' },
    { name: 'August' },
    { name: 'September' },
    { name: 'October' },
    { name: 'November' },
    { name: 'December' }
  ];

  yearlist: any[] = [
    { name: '2022' },
    { name: '2023' },
    { name: '2024' }
  ];

  count : number;
  docDispName : string;
  docDispID : string;

  configDoc = {
    displayKey: "custom",// custom values are passed, defined below :
    search: true,
    limitTo: 10,
    clearOnSelection:true,
    placeholder:'Select Doctor'
  };
  constructor(private doctorservice: DoctorService,
              private calenderservice: CalenderService,
              private router: Router,
              public dialog: MatDialog,) { }

  ngOnInit(): void {
        
    this.updPayVisible = false;
   
    this.paymentfrmgrp = new FormGroup({
      GrossValueinINR: new FormControl('', [Validators.required]),
      Commission: new FormControl('', [Validators.required]),
      TDS: new FormControl('', [Validators.required]),
      NetValueinINR: new FormControl('', [Validators.required]),
      PayDate_1 :new FormControl('',),
      Payment_Amount_1 :new FormControl('',),
      Transactiondetail:new FormControl('',),
      PayDate_2:new FormControl('',),
      Payment_Amount_2 :new FormControl('',),
      Grossamt_upd :new FormControl('',),
      consent: new FormControl('',),
    });

    this.withConsent=false;

    this.monthfrmgrp = new FormGroup({
      month: new FormControl(''),
      year: new FormControl(''),
    });

    if(this.selectdocid == undefined){
      this.selectdocid = 100;
    }
    this.getDoctorList();
    let jsonItem  = JSON.parse(sessionStorage.getItem('valitem'));
    if(jsonItem.userrole == "doctor"){
      this.isAdmin = false;
      let docDetails = JSON.parse(sessionStorage.getItem("doctorDetails"));
      let docdetid = docDetails.ListPatDet[0].docdetid;
      this.docDispName = jsonItem.userfname + ' ' + jsonItem.userlname;
      this.docDispID = docdetid;
      this.idDrSelected = true;
      this.selectdocid = docdetid;
      this.layout_monthly = true;
      this.getMonthlyList();
    }else{
      this.isAdmin = true;
      if(this.layout_summary){
        this.layout_summary = true;
        this.getLedgerList();
      }else{
        this.layout_consult = true;
        this.getConsultList();
      }
    }
  }

  get p() { return this.paymentfrmgrp.controls; }

  get m() { return this.monthfrmgrp.controls; }

  add1Event(change:string ,event: any)
  {   
    this.PaymentDate_1 = this.datePipeEn.transform(this.PayDate_1.value,"yyyy-MM-dd");
  }

  add2Event(change:string ,event: any)
  {
    this.PaymentDate_2 = this.datePipeEn.transform(this.PayDate_2.value,"yyyy-MM-dd");
  }

  onTabClick(id:number)
  {
    switch(id)
      {
        case 2:
        {
          this.layout_consult = false;
          this.layout_monthly = true;
          this.layout_summary = false;
          this.getMonthlyList();
          break;
        }
        case 3:
        {
          this.layout_consult = false;
          this.layout_monthly = false;
          this.layout_summary = true;
         this.getLedgerList();
          break;
        }
        default:
        {
          this.layout_consult = true;
          this.layout_monthly = false;
          this.layout_summary = false;
          this.getConsultList();
          break;
        }
      }
  }

  private getDoctorList = () => {
    this.doctorservice.Doctor_List('')
    .subscribe(
        data => {
          if(data.status===1000){
            this.isLastDrListed = true;
            this.doclist = data.data.AllDocDet;

            //if we want to display more than one value in the drop-down, we can add it by creating custom value and add it like below
            for (let user of this.doclist) {
              user['custom'] = user.docdet_FullName + ' (' + user.docdet_cat + ')';
            }
            /* this.docdetail = [] as UserModel[];
            this.docdetail.push({ id: 100, name:"All Doctors",spl:'' });
            for (var val of data.data.AllDocDet) {
              let docdet_name = val.docdet_fname+" "+val.docdet_lname; 
              this.docdetail.push({ id:val.docdetid, name:val.docdet_FullName,spl:val.docdet_cat});
            }
            this.doclist = this.docdetail; */
          }else{
           this.isLastDrListed = false;           
          }                          
        },
        error => {
          //this.loading = false;
        });
  }

  onDoctorSelection($event: any) {
    this.idDrSelected = true;
    let selectedDoctor = $event.value;
    this.selectedDoc = selectedDoctor.docdet_FullName;
    this.selectdocid = selectedDoctor.docdetid;
    /* this.selectedDoc = selectedDoc;
    this.selectdocid = this.docdetail.find(x=>x.name == selectedDoc).id; */
    if(this.selectdocid == 100){
      this.idDrSelected = false;
    }
    if(this.layout_consult){
      this.getConsultList();
    }else if(this.layout_monthly){
      this.getMonthlyList();
    }else{
      this.getLedgerList();
    }
  }

  search(){
    this.getMonthlyList();
  }

  searchLedger(){
    this.getLedgerList();
  }
  private getConsultList = () =>
  {
   this.calenderservice.ListDoctorConsults(this.selectdocid)
  .subscribe(
      data => {   
        if(data.status===1000){
          if(data.data!==undefined && data.data!=null){
            this.MyDataConsults = new MatTableDataSource();
            this.MyDataConsults.data = data.data.AllCalDet;
            this.count = this.MyDataConsults.data.length;   
          }
        }else
        {
          this.MyDataConsults = [];
          this.count = 0;
        }
        //this.router.navigate(['/products']);
      },
      error => {
        //this.loading = false;
      });
  }

  private getMonthlyList = () =>
  {
   this.calenderservice.ListMonthlyConsults(this.selectdocid,this.m.month.value,this.m.year.value)
  .subscribe(
      data => {   
        if(data.status===1000){
          if(data.data!==undefined && data.data!=null){
            this.MyMonthlyConsults = new MatTableDataSource();
            this.MyMonthlyConsults.data = data.data.AllCalDet;
            this.count = this.MyMonthlyConsults.data.length;   
          }
        }else{
          this.MyMonthlyConsults = [];
          this.count = 0;
        /* this.showSpinner=false; */
        }
        //this.router.navigate(['/products']);
      },
      error => {
        //this.loading = false;
      });
  }

  private getLedgerList = () =>
  {
  if(this.isAdmin) {
   this.doctorservice.get_ledger_bydocid(this.selectdocid,this.m.month.value,this.m.year.value)
  .subscribe(
      data => {   
        if(data.status===1000){
          if(data.data!==undefined && data.data!=null){
            this.MyLedgerSummary = new MatTableDataSource();
            this.MyLedgerSummary.data = data.data;
            this.doc_ledger_det = data.data
            this.count = this.MyLedgerSummary.data.length;   
            this.findsum(this.doc_ledger_det);  
          }
        }else{
          this.MyLedgerSummary = [];
          this.count = 0;
        }
        //this.router.navigate(['/products']);
      },
      error => {
        //this.loading = false;
      });
    }else{
      this.doctorservice.get_ledger_fordoc(this.selectdocid)
      .subscribe(
          data => {   
            if(data.status===1000){
              if(data.data!==undefined && data.data!=null){
                this.MyLedgerSummary = new MatTableDataSource();
                this.MyLedgerSummary.data = data.data;
                this.doc_ledger_det = data.data
                this.count = this.MyLedgerSummary.data.length;   
              }
            }else{
              this.MyLedgerSummary = [];
              this.count = 0;
            }
            //this.router.navigate(['/products']);
          },
          error => {
            //this.loading = false;
          });
    }
  }

  getCallType(callType : string){
    switch(callType)
    {
      case 'FOLLOWUP':
      {
        this.callTypeDisp = "Free Follow Up";
        return "docGenie-blue dark";
      }
      case 'CANCELLED':
      {
        this.callTypeDisp = "Cancelled";
        return "docGenie-orange dark";  
      }  
      case 'BOOKED': 
      {
        this.callTypeDisp = " ";
        return "";   
      }  
      default:
      {
        this.callTypeDisp = "Paid Consult";
        return "";   
      }
   }
  }

  public hasError = (controlName: string, errorName: string) =>{
    return this.paymentfrmgrp.controls[controlName].hasError(errorName);
  }

  public createSummary = (ownerFormValue) => {
        this.doctorservice.ledger_updateSumm(this.p.Grossamt_upd.value, this.p.Commission.value, this.p.TDS.value, this.p.NetValueinINR.value, this.PaymentDate_1, this.p.Payment_Amount_1.value,this.PaymentDate_2, this.p.Payment_Amount_2.value, this.p.consent.value,this.showupdetail.idDoctor_Consult_summary).subscribe(
          data => {
            if(data.status===1000)
            {
              this.updPayVisible = false;
              this.layout_summary = true;
              this.ngOnInit();
            }else{
             this.openDialog_uppapp("There is an error. Please try again","Ok");
             // console.log(data.msg);
            }
            //this.router.navigate(['/products']);
          },
          error => {
            //this.loading = false;
          });
  }

  openDialog_uppapp(lmsg:string,lmsgtype:string): void {
    let vltdataitem  = JSON.parse(sessionStorage.getItem('valitem'));
    vltdataitem.msg.message=lmsg;
    vltdataitem.msg.msgboxtype = lmsgtype;

   sessionStorage.setItem("valitem",JSON.stringify(vltdataitem));
    const dialogRef = this.dialog.open(MsgdialogComponent, {
      width: '300px',
      data: {},panelClass: 'my-panel'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.updPayVisible = false;
      }
    });
  }

  updatePay(detail:any) {
    window.scrollTo(100,100);
    this.showupdetail = detail;
    this.updPayVisible = true;
    this.paymentfrmgrp.get('Grossamt_upd').setValue(this.showupdetail.Grossamt_upd);
    this.paymentfrmgrp.get('Commission').setValue(this.showupdetail.Commission_upd);
    this.paymentfrmgrp.get('TDS').setValue(this.showupdetail.TDS_upd);
    //this.paymentfrmgrp.get('NetValueinINR').setValue(this.showupdetail.Netvalue_upd);
    this.paymentfrmgrp.get('Payment_Amount_1').setValue(this.showupdetail.Payment_Amount_1);
    this.paymentfrmgrp.get('Payment_Amount_2').setValue(this.showupdetail.Payment_Amount_2);
    this.paymentfrmgrp.get('Transactiondetail').setValue(this.showupdetail.Transactiondetail);
    if(this.showupdetail.PaymentDate_1 == null || this.showupdetail.PaymentDate_1 == ""){
      this.PayDate_1 = new FormControl(new Date());
      this.PaymentDate_1 = this.datePipeEn.transform(this.PayDate_1.value,"yyyy-MM-dd");
    }else{
      this.PayDate_1 = new FormControl(new Date(this.showupdetail.PaymentDate_1));
      this.PaymentDate_1 = this.showupdetail.PaymentDate_1;
    }
    if(this.showupdetail.PaymentDate_2 == null || this.showupdetail.PaymentDate_2 == ""){
      this.PayDate_2 = new FormControl(new Date());
    }else{
    this.PayDate_2 = new FormControl(new Date(this.showupdetail.PaymentDate_2));
    this.PaymentDate_2 = this.showupdetail.PaymentDate_2;
    }
    if(this.showupdetail.displaystatus == 1){
      this.withConsent = true;
    }else{
      this.withConsent = false;
    }
    if(this.showupdetail.Netvalue_upd == 0){
      let gross = this.showupdetail.GrossValueinINR;
      let netValue = gross *0.8*0.9;
      this.paymentfrmgrp.get('NetValueinINR').setValue(netValue);
    }else{
      this.paymentfrmgrp.get('NetValueinINR').setValue(this.showupdetail.Netvalue_upd);
    }
  }

  onEnter(grossUpd : any){
    let netValue = grossUpd*0.8*0.9;
    this.paymentfrmgrp.get('NetValueinINR').setValue(netValue);
    this.updPayVisible = true;
  }
  getChStatus(dispStatus : number){
    if(dispStatus == 1){
      this.withConsent = true;
      return true;
    }else {
      return false;
    }
  }
  public processpay(id:number)
  {
    let j=this.doc_ledger_det.find(x=>x.idDoctor_Consult_summary == id).GrossValueinINR;
  }

  onSideClick(speciality : string){
    this.router.navigate([speciality]);
  }

  divClose(){
    this.router.navigate(['/home']);
  }

  findsum(data){    
    //debugger  
    this.value = data;
    this.totalFollups = this.totalPaidTrans = this.totalGross = this.totalNet = 0;
    for(let j=0;j<data.length;j++){   
      this.totalPaidTrans+= this.value[j].NoOfTransactions;
      this.totalFollups+= this.value[j].NoOfFollows;
      this.totalGross+= this.value[j].GrossValueinINR;
      this.totalNet+= this.value[j].Netvalue_upd;
    }
  }  
   
}


import { Component , OnInit, ViewChild} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PatientService } from 'src/services/patient_details/patient.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { PatientDetail } from 'src/models/patientlist/datum'
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';
import { MsgdialogComponent } from 'src/app/msgdialog/msgdialog.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { CalenderService } from 'src/services/calenderdetails/calender.service';

@Component({
  selector: 'app-admin-list-login',
  templateUrl: './admin-list-login.component.html',
  styleUrls: ['./admin-list-login.component.css'],
  providers: [DatePipe]
})
export class AdminListLoginComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;   

  pgIndex= 2;
  firstLastButtons= true;
  pnDisabled= true;
  hdPageSize= true;

  userrole:string;
  DOCTOR_LIST: PatientDetail[];
  MyDataSource: any;
  public registerfrmgrp: FormGroup;
  sort: MatSort;
  count : number;
  ShowUpCall:boolean;
  ShowUpCallnotes:string;
  showupdetail:any;
  showupcallperson:string;
  callList: string[] = [
    "Himani",
    "Neenu",
    "Akriti"
  ];
  isRemarks : boolean = false;
  bookDetails : string = '';

  constructor(private router: Router,
    private userservice: PatientService,public dialog: MatDialog,public calenderService : CalenderService) { }

  ngOnInit() 
  {
    this.ShowUpCall = false;
    this.registerfrmgrp = new FormGroup({
      srchstr: new FormControl('',[Validators.required]),
      remarks: new FormControl('',[Validators.required]),
      call: new FormControl('',[Validators.required]),
    });
    let jsonItem  = JSON.parse(sessionStorage.getItem('valitem'));
    this.userrole = jsonItem.userrole;
    this.executeOwnerCreation();        
  }
      
  get r() { return this.registerfrmgrp.controls; }

  public hasError = (controlName: string, errorName: string) =>{
    return this.registerfrmgrp.controls[controlName].hasError(errorName);
  }

  private executeOwnerCreation = () => {
    this.userservice.Patient_LogList()
    .subscribe(
        data => {
          if(data.status===1000)
          {
            this.MyDataSource = new MatTableDataSource();          
            this.MyDataSource.data = data.data.ListPatDetcalldet;
            this.MyDataSource.sort = this.sort;
            this.count = this.MyDataSource.data.length;     
            this.MyDataSource.paginator = this.paginator;       
          }else{
           this.count = 0;
          }
          //this.router.navigate(['/products']);
        },
        error => {
          //this.loading = false;
        });
  }

  onChangePage(pe:PageEvent) {
    //alert("PageIndex : "+pe.pageIndex+ " Page Size : " +pe.pageSize);
  }
  
  callMethod(value: any, element: any) {
    
    this.showupcallperson = value;
  }

  UpdateCall(detail:any) {
    window.scrollTo(0, 0);
    this.showupdetail = detail;
    this.ShowUpCall = true;
    this.calenderService.ListDoctorpatAppts(" "," ",1000,detail.patdetid,0).subscribe(
      data =>{
        if(data.status == 1000){
          this.bookDetails = "";
          let detail = data.data.AllCalDet;
          for(let i=0; i<detail.length ;i++){
            if(this.bookDetails == ""){
              this.bookDetails = "Tried to book for <b>"+detail[i].docdet_FullName+" ("+detail[i].caldet_calltype+")</b> for  "+detail[i].caldet_date+" at "+detail[i].appslot_sttime+"<br>";
            }else{
              this.bookDetails = this.bookDetails + "Tried to book for <b>"+detail[i].docdet_FullName+" ("+detail[i].caldet_calltype+")</b> for  "+detail[i].caldet_date+" at "+detail[i].appslot_sttime;
            }     
          } 
        }else{
          this.bookDetails = '<i>No Booking Details</i>';
        }
      }
    )
  }

  Savecallnotes()
  {
    this.ShowUpCallnotes = this.r.remarks.value;
    this.userservice.Patient_UpdatecallLog(this.showupcallperson,this.ShowUpCallnotes,this.showupdetail.patdetid)
    .subscribe(
        data => {
          if(data.status===1000)
          {
            this.ShowUpCall = false;
            this.ngOnInit();
          }else{
            this.openDialog_uppapp("There is an error. Please contact Support","Ok");
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
        this.ShowUpCall=false;   
      }
    });
  }

  getRemarks(detail){
    if(detail.callnotes == null){
     return false;
    }else{
      return true;
    }
  }
}

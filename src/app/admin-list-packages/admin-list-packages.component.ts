import { Component, OnInit } from '@angular/core';
import { Data } from 'src/models/allusers/data'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { PacktestService } from 'src/services/packtest/packtest.service';
import { ResponseDetails } from 'src/models/resources/datum'

@Component({
  selector: 'app-admin-list-packages',
  templateUrl: './admin-list-packages.component.html',
  styleUrls: ['./admin-list-packages.component.css'],
  providers: [DatePipe]
})
export class AdminListPackagesComponent implements OnInit {
  showSpinner:boolean=false;
  MyDataSource:any;
  options: Data[];
  myControl: FormControl = new FormControl();
 
  yoursDate: Date;
  startdate:string;
  enddate:string;
  datePipeEn: DatePipe = new DatePipe('en-US');
  count : number;
  userid:string;
  ShowUpApp:boolean;
  isonetofour:boolean;
  isemptyslot:boolean;
  public packfrmgrp:FormGroup;
  date1 = new FormControl(new Date());
  appdet:any;
  SLOT_LIST : ResponseDetails[];
  constructor(  public dialog: MatDialog,
    private datePipe: DatePipe,
    private packservice:PacktestService) { }

 
    
  ngOnInit(): void
  {

    this.packfrmgrp = new FormGroup({
      srchstr: new FormControl('',[Validators.required]),
    });
    this.ShowUpApp = false;
    this.startdate=this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    let days=90;
    this.yoursDate=new Date();
    this.yoursDate.setDate(this.yoursDate.getDate() + days);
    this.enddate =this.datePipe.transform(this.yoursDate, 'yyyy-MM-dd');
    this.showSpinner=true;
    this.GetPackages("");
  }

  get f() { return this.packfrmgrp.controls; }

  public hasError = (controlName: string, errorName: string) =>{
    return this.packfrmgrp.controls[controlName].hasError(errorName);
  }
  addEvent(change:string ,event: any)
  {
    this.startdate  = this.datePipe.transform((<HTMLInputElement>document.getElementById("startdate")).value,'yyyy-MM-dd');
    this.enddate  = this.datePipe.transform((<HTMLInputElement>document.getElementById("enddate")).value,'yyyy-MM-dd');
    this.GetPackages("");
  }

  search()
  {
    this.GetPackages(this.f.srchstr.value);
  }
  private GetPackages = (packstr : string) =>
{
  this.showSpinner=true;

  this.packservice.listpack(this.startdate,this.enddate,packstr)
  .subscribe(
    data => {
    
      if(data.status===1000){
        if(data.data!==undefined && data.data!=null){
          this.MyDataSource = new MatTableDataSource();
          this.MyDataSource.data = data.data;
          this.count = this.MyDataSource.data.length;
          this.showSpinner=false;
        }
      }else{
       this.showSpinner=false;
      }
      //this.router.navigate(['/products']);
    },
    error => {
      //this.loading = false;
    });


}

}

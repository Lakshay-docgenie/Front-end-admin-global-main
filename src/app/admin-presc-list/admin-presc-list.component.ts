import { Component, OnInit } from '@angular/core';
import { Data } from 'src/models/allusers/data'
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { CalenderService } from 'src/services/calenderdetails/calender.service'
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-presc-list',
  templateUrl: './admin-presc-list.component.html',
  styleUrls: ['./admin-presc-list.component.css'],
  providers: [DatePipe]

})
export class AdminPrescListComponent implements OnInit {

  MyDataSource:any;
  options: Data[];
  myControl: FormControl = new FormControl();
 
  yoursDate: Date;
  startdate:string;
  enddate:string;
  datePipeEn: DatePipe = new DatePipe('en-US');
  count : number;
  userid:string;
  public registerfrmgrp: FormGroup;
  patPhNo : number = 0;

  prescSentType : string;
  public displayAppdate:FormGroup;
  startDatePicker = new FormControl(new Date());
  endDatePicker = new FormControl(new Date());

  constructor(public dialog: MatDialog,
    private calenderservice: CalenderService,
    private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.displayAppdate = new FormGroup({
      startDatePicker: new FormControl(''),
      endDatePicker: new FormControl('')
    });

    this.startdate=this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    let days=90;
    this.yoursDate=new Date();
    this.yoursDate.setDate(this.yoursDate.getDate() + days);
    this.enddate =this.datePipe.transform(this.yoursDate, 'yyyy-MM-dd');
    let jsonItem  = JSON.parse(sessionStorage.getItem('valitem'));
    this.userid = jsonItem.userfname
    this.registerfrmgrp = new FormGroup({
      srchstr: new FormControl(''),
    });
    this.GetPrescDetails();
  }

  get f() { return this.registerfrmgrp.controls; }

  public hasError = (controlName: string, errorName: string) =>{
    return this.registerfrmgrp.controls[controlName].hasError(errorName);
  }

  addEvent(change:string ,event: any)
  {
    this.startdate  = this.datePipe.transform(this.startDatePicker.value,'yyyy-MM-dd');
    this.enddate  = this.datePipe.transform(this.endDatePicker.value,'yyyy-MM-dd');
    this.GetPrescDetails();
  }

  private GetPrescDetails = () =>
  {
  this.calenderservice.ListPrescDetails(this.startdate,this.enddate,this.patPhNo)
  .subscribe(
    data => {
      if(data.status===1000){
        if(data.data!==undefined && data.data!=null){
          this.MyDataSource = new MatTableDataSource();
          this.MyDataSource.data = data.data.AllCalDet;
          this.count = this.MyDataSource.data.length;
          this.patPhNo = 0;
          this.registerfrmgrp.get('srchstr').setValue('');
        }
      }else{
        this.MyDataSource ="";
      }
      //this.router.navigate(['/products']);
    },
    error => {
      //this.loading = false;
    });
  }

  getColor(prescSent : string){
    if(prescSent == "N"){
      this.prescSentType = "N";
      return "docGenie-blue";
    }else{
      this.prescSentType = "Y";
      return "docGenie-orange";
    }
  }
  
  search()
  {
    this.patPhNo = this.f.srchstr.value;
    this.GetPrescDetails();
  }
}


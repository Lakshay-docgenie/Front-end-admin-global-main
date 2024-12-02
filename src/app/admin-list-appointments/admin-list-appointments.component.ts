import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { animate, state, style, transition, trigger} from '@angular/animations';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Data } from 'src/models/allusers/data'
import { FormControl, FormGroup } from '@angular/forms';
import { ResponseDetails } from 'src/models/resources/datum';
import { CalenderService } from 'src/services/calenderdetails/calender.service'
import { MatDialog } from '@angular/material/dialog';
import { MsgdialogComponent } from 'src/app/msgdialog/msgdialog.component';
import { AppSlotService } from 'src/services/appslot/appslot.service';
import { PatientService } from 'src/services/patient_details/patient.service';
import { Router } from '@angular/router';
import { HttpClient} from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { UploadFileBody } from 'src/models/uploadFile/body';
import { UserService } from 'src/services/users_list/userlist.service';
import { DeviceDetComponent } from '../device-det/device-det.component'

@Component({
  selector: 'app-admin-list-appointments',
  templateUrl: './admin-list-appointments.component.html',
  styleUrls: ['./admin-list-appointments.component.css'],
  providers: [DatePipe],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AdminListAppointmentsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;   

  pgIndex= 2;
  firstLastButtons= true;
  pnDisabled= true;
  hdPageSize= true;

  columnsToDisplay = ['date', 'time', 'patients', 'doctor','promocode', 'actions'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: PeriodicElement | null;
  showSpinner:boolean=false;
  MyDataSource:any;
  options: Data[];
  myControl: FormControl = new FormControl();
 
  yoursDate: Date;
  startdate:string;
  enddate:string;
  datePipeEn: DatePipe = new DatePipe('en-US');
  count : number;
  todayCount : number;
  monthCount : number;
  userid:string;
  ShowUpApp:boolean;
  isonetofour:boolean;
  isemptyslot:boolean;
  public frmappdate:FormGroup;
  public displayAppdate:FormGroup;
  date1 = new FormControl(new Date());
  startDatePicker = new FormControl(new Date());
  endDatePicker = new FormControl(new Date());
  appdet:any;
  SLOT_LIST : ResponseDetails[][];
  public registerfrmgrp: FormGroup;
  patPhNo : number = 0;

  multipleImages = [];
  fileLength : string;
  fileTitle : string;
  prescSentType : string;
  userrole : string;
  clinicID : number = 0;
  isClinic : boolean = false;
  clinicAddress : string;
  holdCanclStr : string;
  isRescheduled : boolean = false;
  /* clinicAddress1 : string;
  clinicAddress2 : string; */

  constructor(  public dialog: MatDialog,
                private calenderservice: CalenderService,
                private datePipe: DatePipe,
                private appslotservice: AppSlotService,
                private userservice: PatientService,
                private router: Router,
                private http: HttpClient,
                private userService : UserService) { }

  ngOnInit(): void
  {
    this.ShowUpApp = false;
    this.startdate=this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    let days=90;
    this.yoursDate=new Date();
    this.yoursDate.setDate(this.yoursDate.getDate() + days);
    this.enddate =this.datePipe.transform(this.yoursDate, 'yyyy-MM-dd');
    let jsonItem  = JSON.parse(sessionStorage.getItem('valitem'));
    this.userid = jsonItem.userfname;
    this.userrole = jsonItem.userrole;
    this.showSpinner=true;
    this.frmappdate = new FormGroup({
      date1: new FormControl('')
    });
    this.displayAppdate = new FormGroup({
      startDatePicker: new FormControl(''),
      endDatePicker: new FormControl('')
    });
    this.registerfrmgrp = new FormGroup({
      srchstr: new FormControl(''),
    });
  this.GetAppoinments();
  }

  get f() { return this.registerfrmgrp.controls; }

  public hasError = (controlName: string, errorName: string) =>{
    return this.registerfrmgrp.controls[controlName].hasError(errorName);
  }

  addEvent(change:string ,event: any)
  {
    this.startdate  = this.datePipe.transform(this.startDatePicker.value,'yyyy-MM-dd');
    this.enddate  = this.datePipe.transform(this.endDatePicker.value,'yyyy-MM-dd');
    this.GetAppoinments();
  }

  addEvent_to(change:string ,event: any)
  {
    this.listappslot(this.datePipeEn.transform(this.date1.value,'yyyy-MM-dd'),this.appdet.docdet_docid,this.appdet.caldet_calltype);
  }

  /* Step 4 - Displays app slots */
 private listappslot = (appdate:string,docdetid:number,calltype:string) => {
  this.appslotservice.GetApptAllSlots(appdate,docdetid,calltype,"")
      .subscribe(
          data => {
            if(data.status===1000){
              this.showSpinner=false;
              if(data.data!==null && data.data!==undefined){
                if(data.data.Allappslot!=null && data.data.Allappslot!==undefined){
                  this.SLOT_LIST = data.data.Allappslot;
                  if(calltype == "CLINIC"){
                    this.isClinic = true;
                  }else{
                    this.isClinic = false;
                  }
                  this.isemptyslot=false;
                }else{
                  this.isemptyslot=true;
                }
              }
            }
            else{
              if(data.status===1402)
              {
                this.showSpinner=false;
                this.isemptyslot=true;
              }
            }
          },
          error => {
            this.showSpinner=false;
            //this.loading = false;
          });
  }

  Updateappointment(appid:number, clinicID : number)
  {
    if(this.appdet.caldet_calltype == "CLINIC"){
      this.clinicID = clinicID;
    }
    this.UpdateCalender_Patient(this.datePipeEn.transform(this.date1.value,'yyyy-MM-dd'),appid,this.appdet.caldetid)
  }

  private UpdateCalender_Patient = (appdate: string, appid: number,caldetid:number) => {
    this.showSpinner=true;
    this.isRescheduled = true;
    this.calenderservice.UpdateCalender(appdate, appid ,caldetid,this.userrole,this.clinicID)
    .subscribe(
        data => {
         
          if(data.status===1000)
          {
            this.showSpinner=false;
            this.openDialog_uppapp("Appoinment Rescheduled","Ok");
            this.ngOnInit();
          }
          else if(data.status===1002)
          {
            this.showSpinner=false;
            this.openDialog_uppapp(data.msg,"Ok");
          }
          else
          {
            this.showSpinner=false;
            this.openDialog_uppapp("There is a error Please contact Docgenie Support","Ok");
          }
          this.isRescheduled = false;
        },
        error => {
          this.showSpinner=false;
          this.isRescheduled = false;
          this.openDialog_uppapp("There is a error Please contact Docgenie Support","Ok");
        });
  }

private GetAppoinments = () =>
{
  this.showSpinner=true;
  let docdetid=100;
  let patdetid=100;

this.calenderservice.ListDoctorpatAppts(this.startdate,this.enddate,docdetid,patdetid,this.patPhNo)
.subscribe(
    data => {
    
      if(data.status===1000){
        if(data.data!==undefined && data.data!=null){
          this.MyDataSource = new MatTableDataSource();
          this.MyDataSource.data = data.data.AllCalDet;
          this.count = this.MyDataSource.data.length;
          this.MyDataSource.paginator = this.paginator;  
          this.todayCount = data.data.AllCalDet[0].todayCount;
          this.monthCount = data.data.AllCalDet[0].monthCount;
          this.showSpinner=false;
          this.patPhNo = 0;
          this.registerfrmgrp.get('srchstr').setValue('');
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

onChangePage(pe:PageEvent) {
  //alert("PageIndex : "+pe.pageIndex+ " Page Size : " +pe.pageSize);
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
  this.GetAppoinments();
}

  filter(val: string): string[] {
    return this.options.map(x => x.login_userid).filter(option =>
      option.toLowerCase().includes(val.toLowerCase()));
  }

  getCallType(callType : string){
    if(callType == "FOLLOWUP"){
      return '(F)';
    }else{
      return '';
    }
  }

  getapptype(getapptype:string)
  { 
    if(getapptype.substr(0,3)=='PCK')
    {
      return 'PACKAGE APPOINTMENT';
    }else
    {
      return '';
    }
  }

   invoiceGenerate(caldetid:any) 
  {
   //this.openDialog("Are you sure to cancel the appoinment","YesNo",caldetid);
   let vltdataitem  = JSON.parse(sessionStorage.getItem('valitem'));
   vltdataitem.caldetid = caldetid;
   sessionStorage.setItem("valitem",JSON.stringify(vltdataitem));
   this.router.navigate(['/admin_list_payments']);
  }

  CancelUpapp()
  {
    this.ShowUpApp=false;
    this.appdet=null;
  }

  Updateapp(detail:any) 
  {    
    window.scrollTo(0,0);
    this.appdet=detail;
    this.ShowUpApp=true;
    this.listappslot(this.datePipeEn.transform(this.date1.value,'yyyy-MM-dd'),this.appdet.docdet_docid,this.appdet.caldet_calltype);
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
        this.ShowUpApp=false;
      }
    });
  }

  selectMultipleImage(event,patdetid)
  {
    this.multipleImages = [];
    const file =  event.target.files.length;
    for(var i =  0; i <  event.target.files.length; i++)  
    {
      if (this.userservice.is4MBFileSize(event,i)) {
        this.openDialog_uppapp(event.target.files[i].name+" is over the size limit. Please upload files less than 4 MB","Ok");
       /*  exit(); */
      }else{
        this.multipleImages.push(event.target.files[i]);
      } 
    }
    this.onMultipleSubmit(patdetid);
  }

    onMultipleSubmit(patdetid)
    {
      this.showSpinner=true;
      let url : string;
      this.userService.data$.subscribe(data => {
        url = data;
      });
      const formData =  new  FormData();
      formData.append("patdetid", patdetid);
      for  (var i =  0; i <  this.multipleImages.length; i++)  {
        formData.append("file[]",  this.multipleImages[i]);
      }
      this.http.post<UploadFileBody>(`${url}s3FileUploads/uploadmultiplefileS3.php`,formData)
        .subscribe(data => {
          this.showSpinner=false;
          if(data.status==1000){
            let fileUploaded = data.data.fileName;
            this.openDialog_uppapp("Files uploaded - "+fileUploaded,"Ok");
            this.ngOnInit();
          }else{
            this.openDialog_uppapp("Sorry! File not uploaded.","Ok");
          }
        })
    }
    
    getCallStatus(callstatus:string)//:string
    {
      if(callstatus=="CONFIRMED")
      {
        return true;
      }
      else if(callstatus=="CANCELLED"){
        this.holdCanclStr = "Appointment Cancelled";
        return false;
      }else if(callstatus=="HOLD"){
        this.holdCanclStr = "Appointment on Hold";
        return false;
      }
    }

    isVideo(calltype:string)
    {
      if(calltype=="VIDEO")
      {
        return true;
      }
      else{
        return false;
      }
    }

    devDet(caldetid:number)
    {
      if(caldetid)
      {        
        this.devMob(caldetid)
      }
    }  
 
    private devMob  = (caldetid:number)=>{ 
      this.calenderservice.mobDev(caldetid)
        .subscribe( 
          data => {
            if(data.status===1000)
              
            {  
                const dialogRef =  this.dialog.open(DeviceDetComponent,{
                  width :'600px',
                  data :{data : data.data.AllCalDet}
                });
            }
            else
            {
              this.openDialog_uppapp("No data available for this link","Ok");
            }
          error => 
          {
            this.showSpinner=false;
          }
        });
      }
  

    getPromoStatus(promocode : string){
      if(promocode == "DGPLINK" || promocode == "CASH"){
        return true;
      }else{
        return false;
      }
    }
}

export interface PeriodicElement {
  date: string;
  time: number;
  patients: number;
  doctor: string;
  promocode : string,
  description: string;
}

import { Component, OnInit } from '@angular/core';
import { Data } from 'src/models/allusers/data'
import { FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { CalenderService } from 'src/services/calenderdetails/calender.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MsgdialogComponent } from 'src/app/msgdialog/msgdialog.component';
import { resource_response } from 'src/models/resources/body';
import { UploadFileBody } from 'src/models/uploadFile/body';
import { UserService } from 'src/services/users_list/userlist.service';
import { LabtestOrderComponent } from '../labtest-order/labtest-order.component';

@Component({
  selector: 'app-admin-list-labtest',
  templateUrl: './admin-list-labtest.component.html',
  styleUrls: ['./admin-list-labtest.component.css'],
  providers: [DatePipe]
})
export class AdminListLabtestComponent implements OnInit {
  showSpinner:boolean=false;
  MyDataSource:any;
  options: Data[];
  myControl: FormControl = new FormControl();
  yoursDate: Date;
  startdate:string;
  enddate:string;
  count : number;
  totAmt : number;
  multipleImages = [];
  images;
  url : string;
  showupdetail:any;
  ShowUpCancel:boolean;
  cancellationExplanation : string = '';

  public displayAppdate:FormGroup;
  startDatePicker = new FormControl(new Date());
  endDatePicker = new FormControl(new Date());

  constructor(private calenderService: CalenderService,
    private datePipe: DatePipe,
    private http: HttpClient, 
    private dialog: MatDialog,
    private userService : UserService) { }

  ngOnInit(): void {
    this.ShowUpCancel = false;
    this.displayAppdate = new FormGroup({
      startDatePicker: new FormControl(''),
      endDatePicker: new FormControl('')
    });  
    this.userService.data$.subscribe(data => {
      this.url = data;
    });
  this.startdate=this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  let days=91;
  this.yoursDate=new Date();
  this.yoursDate.setDate(this.yoursDate.getDate() + days);
  this.enddate =this.datePipe.transform(this.yoursDate, 'yyyy-MM-dd');
  this.showSpinner=true;
  this.GetDocAppoinments();
  }

  addEvent(change:string ,event: any)
  {
    this.startdate  = this.datePipe.transform(this.startDatePicker.value,'yyyy-MM-dd');
    this.enddate  = this.datePipe.transform(this.endDatePicker.value,'yyyy-MM-dd');
    this.GetDocAppoinments();
  }

  private GetDocAppoinments = () =>
  {
    this.showSpinner=true;
    this.calenderService.ListPatientLabtest(this.startdate,this.enddate,'')
    .subscribe(
      data => {
        if(data.status===1000){
            this.MyDataSource = new MatTableDataSource();
            this.MyDataSource.data = data.data.ListPattest;
            this.count = this.MyDataSource.data.length;
            this.showSpinner=false;
            this.getTotalAmt(this.count);

        }else{
          this.showSpinner=false;
        }
        //this.router.navigate(['/products']);
      },
      error => {
        //this.loading = false;
      });
  }

  cancelOderAPI(fileID : string){
    let labStatus;
    if(fileID && this.cancellationExplanation){
      this.calenderService.lab_orderCancel(fileID,this.cancellationExplanation).subscribe(
        data => { 
          if(data.status == 1000){
            labStatus = data.data;
          }else{
            labStatus = data.msg;
          }
          this.openDialog(labStatus,"Ok");
        }
      )
    }else{
      if(!this.cancellationExplanation){
        this.dialog.open(LabtestOrderComponent,{
          width :'600px',
          data :{data : "Please enter the reason for cancellation"}
        });
      }
    }
  }

  cancelOrder(detail:any) {
    window.scrollTo(0, 0);
    this.showupdetail = detail;
    this.ShowUpCancel = true;
  }

  filter(val: string): string[] {
    return this.options.map(x => x.login_userid).filter(option =>
      option.toLowerCase().includes(val.toLowerCase()));
  }

  getTotalAmt(len : number){
    this.totAmt = 0;
    for (let i=0;i<len;i++){
      this.totAmt = this.totAmt + this.MyDataSource.data[i].lbtst_amount
    }
  }

  onStatus(fileID : string){
    let labStatus;
    if(fileID){
      this.calenderService.lab_orderCheck(fileID).subscribe(
        data => { 
          if(data.status == 1000){
            labStatus = data.data;
          }else{
            labStatus = data.msg;
          }
          this.dialog.open(LabtestOrderComponent,{
            width :'600px',
            data :{data : labStatus}
          });
        }
      )
    }
  }

  selectMultipleImage(event,patid,testID)
  {
    if(event.target.files.length > 0){
      const file = event.target.files[0];
      if (file.size/1024/1024 > 4) 
      {
        this.openDialog(event.target.files[0].name+" is over the size limit. Please upload files less than 4 MB","Ok");
        /* exit(); */
       }else{
        this.images = file;
       }
      }
      this.onSubmit(patid,testID);
  }

  onSubmit(patid,testID){
    this.showSpinner=true;
    const formData = new FormData();
    formData.append("patid", patid);
    formData.append("testid", testID);
    formData.append('file',this.images);
    this.http.post<resource_response>(`${this.url}s3FileUploads/uploadLabReport.php`,formData)
    .subscribe(res => {
      if(res.status==1000){
        this.showSpinner=false;
        this.openDialog("Report Uploaded and Sent to Patient","Ok");
      }
      else if(res.status==1003){
        this.showSpinner=false;
        this.openDialog("Patient's Email is missing. Mail not sent, but report uploaded!","Ok");
      }
      else
      {
        this.showSpinner=false;
        this.openDialog(res.msg,"Ok");
      }
    })
  }

    openDialog(lmsg:string,lmsgtype:string): void {
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
          this.ShowUpCancel = false;
        //this.router.navigate(['home']);
        }
      });
    }

    getReport(testReport:string) //:string
    {
      if(testReport=="Y")
      {
        return true;
      }
      else{
        return false;
      }
  }

}

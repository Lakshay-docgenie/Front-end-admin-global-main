import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/services/users_list/userlist.service';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-mis-reports',
  templateUrl: './mis-reports.component.html',
  styleUrls: ['./mis-reports.component.css'],
  providers: [DatePipe]

})
export class MisReportsComponent implements OnInit {
  iscitywiseCount : boolean = false;
  ishealthcareCount : boolean = false;
  isprobldio : boolean = false;
  islabtestCount : boolean = false;
  islabtestname : boolean = false;
  islabtestcity : boolean = false;
  isdoccount : boolean = false;
  isspclcount : boolean = false;
  isPatCityCount : boolean = false;


  MyDataSource: any;
  
  startdate:string;
  enddate:string;
  datePipeEn: DatePipe = new DatePipe('en-US');
  count : number;

  public displayAppdate:FormGroup;
  startDatePicker = new FormControl(new Date());
  endDatePicker = new FormControl(new Date());

  constructor(private userServ : UserService,
              private datePipe: DatePipe) { }


  ngOnInit(): void {
    this.displayAppdate = new FormGroup({
      startDatePicker: new FormControl(''),
      endDatePicker: new FormControl('')
    }); 
  }

  
addEvent(change:string ,event: any)
{
  this.startdate  = this.datePipe.transform(this.startDatePicker.value,'yyyy-MM-dd');
  this.enddate  = this.datePipe.transform(this.endDatePicker.value,'yyyy-MM-dd');

  if(this.isdoccount){
    this.doctorwiseCount();
  }
  else if(this.isspclcount){
    this.docspclCount();
  }
  else {
    this.patcitywisecount();
  }
  
  
}

  onCityCount(){
    this.iscitywiseCount = true;
    this.ishealthcareCount  = false;
    this.isprobldio= false;
    this.islabtestCount = false;
    this.islabtestname  = false;
    this.islabtestcity = false;
    this.isPatCityCount = false;
    this.isspclcount = false;
    this.isdoccount = false;
    this.cityPatientCount();
  }

  private cityPatientCount = () => {
    this.userServ.citywiseCount()
    .subscribe(
        data => {
          if(data.status===1000)
          {
            this.MyDataSource = new MatTableDataSource();
            this.MyDataSource.data = data.data.CityCntDet;
            console.log(this.MyDataSource.data)
              /* this.MyDataSource.sort = this.sort;
              this.count = this.MyDataSource.data.length;
             */
          }else{
            //alert(data.msg);
            console.log(data.msg);
          }
          //this.router.navigate(['/products']);
        },
        error => {
          //this.loading = false;
        });
}
onHealthcare(){
  this.iscitywiseCount = false;
  this.ishealthcareCount = true;
  this.isprobldio= false; 
  this.islabtestCount = false;
  this.islabtestname  = false;
  this.islabtestcity = false;
  this.isPatCityCount = false;
  this.isspclcount = false;
  this.isdoccount = false;
  this.Healthcare();
}

private Healthcare = () => {
  this.userServ.Healthcaredet()
  .subscribe(
      data => {
        if(data.status===1000)
        {
          this.MyDataSource = new MatTableDataSource();
          this.MyDataSource.data = data.data.ListPackDet;
          console.log(this.MyDataSource.data)
            /* this.MyDataSource.sort = this.sort;
            this.count = this.MyDataSource.data.length;
           */
        }else{
          //alert(data.msg);
          console.log(data.msg);
        }
        //this.router.navigate(['/products']);
      },
      error => {
        //this.loading = false;
      });
}


onProbldia(){
  this.iscitywiseCount = false;
  this.ishealthcareCount = false;
  this.isprobldio = true;
  this.islabtestCount = false;
  this.islabtestname  = false;
  this.islabtestcity = false;
  this.isPatCityCount = false;
  this.isspclcount = false;
  this.isdoccount = false;
  this.Probldia();
}

private Probldia = () => {
  this.userServ.Probldiadet()
  .subscribe(
      data => {
        if(data.status===1000)
        {
          this.MyDataSource = new MatTableDataSource();
          this.MyDataSource.data = data.data.Listprobldia;
          console.log(this.MyDataSource.data)
            /* this.MyDataSource.sort = this.sort;
            this.count = this.MyDataSource.data.length;
           */
        }else{
          //alert(data.msg);
          console.log(data.msg);
        }
        //this.router.navigate(['/products']);
      },
      error => {
        //this.loading = false;
      });
}


onlabtestCount(){
  this.iscitywiseCount = false;
  this.ishealthcareCount = false;
  this.isprobldio= false; 
  this.islabtestCount = true;
  this.islabtestname  = false;
  this.islabtestcity = false;
  this.isPatCityCount = false;
  this.isspclcount = false;
  this.isdoccount = false;
  this.labtestCount();
}

private labtestCount = () => {
  this.userServ.cityCount()
  .subscribe(
      data => {
        if(data.status===1000)
        {
          this.MyDataSource = new MatTableDataSource();
          this.MyDataSource.data = data.data.labDet;
          console.log(this.MyDataSource.data)
            /* this.MyDataSource.sort = this.sort;
            this.count = this.MyDataSource.data.length;
           */
        }else{
          //alert(data.msg);
          console.log(data.msg);
        }
        //this.router.navigate(['/products']);
      },
      error => {
        //this.loading = false;
      });
}


onlabtestname(){
  this.islabtestCount = false;
  this.islabtestname  = true;
  this.islabtestcity = false;
  this.iscitywiseCount = false;
  this.ishealthcareCount = false;
  this.isprobldio = false;
  this.labtest();
}

private labtest = () => {
  this.userServ.labtest()
  .subscribe(
      data => {
        if(data.status===1000)
        {
          this.MyDataSource = new MatTableDataSource();
          this.MyDataSource.data = data.data.labtestDet;
          console.log(this.MyDataSource.data)
            /* this.MyDataSource.sort = this.sort;
            this.count = this.MyDataSource.data.length;
           */
        }else{
          //alert(data.msg);
          console.log(data.msg);
        }
        //this.router.navigate(['/products']);
      },
      error => {
        //this.loading = false;
      });
}


onlabcity(){
  this.islabtestCount = false;
  this.islabtestname  = false;
  this.islabtestcity = true;
  this.iscitywiseCount = false;
  this.ishealthcareCount = false;
  this.isprobldio = false;
  this.isPatCityCount = false;
  this.isspclcount = false;
  this.isdoccount = false;
  this.labcity();
}

private labcity = () => {
  this.userServ.labcity()
  .subscribe(
      data => {
        if(data.status===1000)
        {
          this.MyDataSource = new MatTableDataSource();
          this.MyDataSource.data = data.data.labtestcity;
          console.log(this.MyDataSource.data)
            /* this.MyDataSource.sort = this.sort;
            this.count = this.MyDataSource.data.length;
           */
        }else{
          //alert(data.msg);
          console.log(data.msg);
        }
        //this.router.navigate(['/products']);
      },
      error => {
        //this.loading = false;
      });
}

  

ondoccount(){
  this.clearDate();
  this.isdoccount = true;
  this.isPatCityCount = false;
  this.isspclcount = false;
  this.islabtestCount = false;
  this.islabtestname  = false;
  this.islabtestcity = false;
  this.iscitywiseCount = false;
  this.ishealthcareCount = false;
  this.isprobldio = false;
  this.doctorwiseCount();
}

private doctorwiseCount = () => {
  this.userServ.doccount(this.startdate,this.enddate)
  .subscribe(
      data => {
        if(data.status===1000)
        {
          this.MyDataSource = new MatTableDataSource();
          this.MyDataSource.data = data.data.Docwisecnt;
            this.count = this.MyDataSource.data.length;
           
        }else{
          this.MyDataSource = [];
        }
      },
      error => {
        //this.loading = false;
      });
}

onspclcount(){
  this.clearDate();
  this.isspclcount = true;
  this.isPatCityCount = false;
  this.isdoccount = false;
  this.islabtestCount = false;
  this.islabtestname  = false;
  this.islabtestcity = false;
  this.iscitywiseCount = false;
  this.ishealthcareCount = false;
  this.isprobldio = false;
  this.docspclCount();
}


private docspclCount = () => {
  this.userServ.spclcount(this.startdate,this.enddate)
  .subscribe(
      data => {
        if(data.status===1000)
        {
          this.MyDataSource = new MatTableDataSource();
          this.MyDataSource.data = data.data.SpclCntDet;
          this.count = this.MyDataSource.data.length;
        }else{
          this.MyDataSource = [];
        }
      },
      error => {
        //this.loading = false;
      });
}

onPatCityCount(){
  this.clearDate();
  this.isPatCityCount = true;
  this.isspclcount = false;
  this.isdoccount = false;
  this.islabtestCount = false;
  this.islabtestname  = false;
  this.islabtestcity = false;
  this.iscitywiseCount = false;
  this.ishealthcareCount = false;
  this.isprobldio = false;
    this.patcitywisecount();
}

private patcitywisecount = () => {
  this.userServ.PatCityCount(this.startdate,this.enddate)
  .subscribe(
      data => {
        if(data.status===1000)
        {
          this.MyDataSource = new MatTableDataSource();
          this.MyDataSource.data = data.data.PatCityCnt;
          this.count = this.MyDataSource.data.length;
            this.count = this.MyDataSource.data.length;
        }else{
          this.MyDataSource = [];
        }
      },
      error => {
        //this.loading = false;
      });
}

  private clearDate(){
    this.startdate = " ";
    this.enddate = " ";
  }

}


import { Component, OnInit } from '@angular/core';
import { Promoservice } from 'src/services/promo/promo.service';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MsgdialogComponent } from 'src/app/msgdialog/msgdialog.component';
import { DoctorService } from 'src/services/doctor_details/doctor.service';
import { UserModel } from 'src/models/usermodel';
import { catModel} from 'src/models/doccat';
import { DatePipe } from '@angular/common';
import { LabtestService } from 'src/services/labtest/labtest.service';
import { labtestDetail } from 'src/models/labtest_listlabtest/datum';

@Component({
  selector: 'app-promocode',
  templateUrl: './promocode.component.html',
  styleUrls: ['./promocode.component.css'],
  providers: [DatePipe]
})
export class PromocodeComponent implements OnInit {
  
  showSpinner=false;
  public registerfrmgrp: FormGroup;

  isitemselected:boolean=false;
  MyDataSource:any;
  promoid;
  
  doclist;
  doccatlist: Array<catModel> = [];
  selectedCat:string;
  selectedDoc:string;
  docdetail: Array<UserModel> = [];
  selectdocid:number;
  selecteddoccat:string;
  selecteddate:string;
  fromDate : string;
  toDate : string;
  datePipeEn: DatePipe = new DatePipe('en-US');
  isASR : boolean;
  selectedpromotype: string;
  promotypes: string[] = ['Lab Test', 'Doctor Appoinment'];
  callTypelist: any[] = [
    { name: 'VIDEO' },
    { name: 'CLINIC' },{ name : 'BOTH'}
];

//declared for lab promo code
islabitemselected:boolean=false;
isdocitemselected:boolean=false;
lablist;
labcatlist: Array<catModel> = [];
selectedlabcat:string;
labdetail:Array<labtestDetail> =[];
selectedlabtest:string;
selectedlabcode:string;

startDatePicker = new FormControl(new Date());
endDatePicker = new FormControl(new Date());
  
  constructor(private promoservice:Promoservice,
              private dialog: MatDialog,
              private doctorservice: DoctorService,
              private labtestser:LabtestService,) { }

  ngOnInit(): void {

    let vltdataitem  = JSON.parse(sessionStorage.getItem('valitem'));

    if(vltdataitem.userrole === "ASR")
    {
      this.isASR=true;
    }
    else
    {
      this.isASR=false;
    }

    this.registerfrmgrp = new FormGroup({

      startdate: new FormControl('',[Validators.required]),
      enddate: new FormControl('',[Validators.required]),
      description: new FormControl('',[Validators.required]),
      promocode: new FormControl('',[Validators.required]),
      promocount: new FormControl('', [Validators.required]),
      discount:new FormControl('', [Validators.required]),
      callType : new FormControl(''),
      doccat: new FormControl('',),
      doctor: new FormControl(''),
      doccatdisp: new FormControl(''),
      labtest: new FormControl(''),
      labcat: new FormControl(''),
      labcatdisp: new FormControl('')
    });

    
    this.fromDate  = this.datePipeEn.transform(new Date(),"yyyy-MM-dd");
    this.toDate  = this.datePipeEn.transform(new Date(),"yyyy-MM-dd"); 

/*     this.registerfrmgrp.get('startdate').setValue("");
    this.registerfrmgrp.get('enddate').setValue(""); */
    /* this.registerfrmgrp.get('fromdate').setValue("");
    this.registerfrmgrp.get('todate').setValue(""); */
    this.registerfrmgrp.get('description').setValue("");
    this.registerfrmgrp.get('promocode').setValue("");
    this.registerfrmgrp.get('promocount').setValue("");
    this.registerfrmgrp.get('discount').setValue("");
    this.registerfrmgrp.get('doccat').setValue("");
    this.registerfrmgrp.get('doctor').setValue("");
  
    this.registerfrmgrp.get('labtest').setValue("");
    this.registerfrmgrp.get('labcat').setValue("");
    this.registerfrmgrp.get('labcatdisp').setValue(""); //this was added by Achlu

 
    this.isitemselected=false;
    this.islabitemselected=false;
    this.isdocitemselected=true;
    this.selectedpromotype = "Doctor Appoinment";

    this.selecteddoccat = "ALLDOC";
    this.selectedlabcat = "ALLLAB";

    this.selectdocid=0;
    

    this.listpromo();
    this.getDoctorList();
    this.getlabList("");
  }

  onclickradio(promotype:string)
  {
    
    switch(promotype)
                {
                  case 'Lab Test':
                    {
                      this.islabitemselected=true;
                      this.isdocitemselected=false;

                      break;
                    }
                  case  'Doctor Appoinment':
                    {
                      
                      this.islabitemselected=false;
                      this.isdocitemselected=true;
                      break;
                    }
                  }
  }

  get f() { return this.registerfrmgrp.controls; }

  public hasError = (controlName: string, errorName: string) =>{
    return this.registerfrmgrp.controls[controlName].hasError(errorName);
  }

  onCatSelection(selectedCat) {
   //alert(selectedCat)
  this.selecteddoccat=this.doccatlist.find(x=>x.desc == selectedCat).cat;
  }

  onDoctorSelection(selectedDoc) {
    this.selectedDoc = selectedDoc;
    this.selectdocid=this.docdetail.find(x=>x.name == selectedDoc).id;
   }


   onlabCatSelection(selectedCat) {
    //alert(selectedCat)
   this.selectedlabcat=this.labcatlist.find(x=>x.desc == selectedCat).cat;
   }
 
   onlabtestSelection(selectedlabtest) {
     this.selectedlabtest = selectedlabtest;
    // alert(this.labdetail.find(x=>x.lbtstname == selectedlabtest).lbtstcode);
     this.selectedlabcode=this.labdetail.find(x=>x.lbtstname == selectedlabtest).lbtstcode;
    }
 
   addFromEvent(change:string ,event: any)
   {
     this.fromDate = this.datePipeEn.transform(this.startDatePicker.value,'MMM-dd-yy');
   }
 
   addToEvent(change:string ,event: any)
   {
     this.toDate = this.datePipeEn.transform(this.endDatePicker.value,'MMM-dd-yy');
   }

  private getDoctorList = () => {
    this.doctorservice.Doctor_List("")
    .subscribe(
        data => {
          if(data.status===1000){
            //this.MyDataSource = new MatTableDataSource();
            this.docdetail = [] as UserModel[];
            this.doccatlist.push({ cat: "ALLDOC",desc:"Applicable for all category" });
            for (var val of data.data.AllDocDet) {
              let docdet_name = val.docdet_fname+" "+val.docdet_lname;
                if(this.doccatlist.find(y=>y.cat == val.docdet_cat)==undefined)
                {
                  this.doccatlist.push({ cat: val.docdet_cat,desc:val.docdet_special });
                }          
              
              this.docdetail.push({ id:val.docdetid, name:docdet_name,spl:''});
            }
            this.doclist = this.docdetail;
          }else{
            console.log(data.msg);
          }                          //this.router.navigate(['/products']);
        },
        error => {
          //this.loading = false;
        });
}

private getlabList = (searcstr) => {
  this.labtestser.listlablist(searcstr)
  .subscribe(
      data => {
        if(data.status===1000){
          //this.MyDataSource = new MatTableDataSource();
          this.labdetail = [] as labtestDetail[];
          this.labcatlist.push({ cat: "ALLLAB",desc:"Applicable for all category" });
          this.lablist = data.data;
          for (var val of data.data) {
            
            
              if(this.labcatlist.find(y=>y.cat == val.lbtstcategory)==undefined)
              {
                //alert(val.lbtstcategory);
                this.labcatlist.push({ cat: val.lbtstcategory,desc:val.lbtstname });
               
              }          
              this.labdetail.push({lbtstid:val.lbtstid,
                lbtstcode :val.lbtstcode,
                lbtstname:val.lbtstname,
                lbtstkeyword: val.lbtstkeyword,
                lbtstmtdofcol:val.lbtstmtdofcol,
                lbtstdaysofrpt: val.lbtstdaysofrpt,
                lbtstref : val.lbtstref,
                lbtstwhytest : val.lbtstwhytest,
                lbtstamount: val.lbtstamount,
                lbtstdiscamount : val.lbtstdiscamount,
                lbtstcategory:val.lbtstcategory,
                lbtsttitle : val.lbtsttitle,
                lbtstdispName : val.lbtstdispName,
                promodiscount:0,
                promofinalamount:0,
                labtest_owner : val.labtest_owner})
            
          }
          this.lablist = this.labdetail;
        }else{
          //alert(data.msg);
          console.log(data.msg);
        }                          //this.router.navigate(['/products']);
      },
      error => {
        //this.loading = false;
      });
}

  Update()
  {
    this.promoservice.Updatepromo(this.promoid,this.f.startdate.value,this.f.enddate.value,this.f.promocount.value,this.f.description.value,this.f.discount.value)
    .subscribe(
        data => {
          if(data.status===1000)
          {
            this.openDialog("Promo Code Updated","Ok");
            this.ngOnInit();
          }else
          {
            this.openDialog("Promo Code Not Updated","Ok");
            this.ngOnInit();

          }
          //this.router.navigate(['/products']);
        },
        error => {
          //this.loading = false;
        });
  }

  Cancel()
  {
   // alert(this.userModels.find(x=>x.id == 1).name);
   
  }

  Add()
  {
    var docorlabcategory;
    var docorlabid;
    var docorlabname;
    var promotype;
    if(this.isdocitemselected)
    {
      if(this.f.callType.value == "BOTH"){
        promotype = "DOC";
      }else{
        promotype = this.f.callType.value;
      }
      docorlabcategory = this.selecteddoccat
      docorlabid = this.selectdocid
      docorlabname = this.selectedDoc
    }
    else{
      promotype = "LAB"
      docorlabcategory = this.selectedlabcat
      docorlabid = this.selectedlabcode
      docorlabname = this.selectedlabtest
    }

    this.promoservice.Createpromo(this.datePipeEn.transform(this.fromDate,'yyyy-MM-dd'),this.datePipeEn.transform(this.toDate,'yyyy-MM-dd'),this.f.promocount.value,this.f.description.value,this.f.discount.value,this.f.promocode.value,docorlabcategory,docorlabid,docorlabname,promotype)/* this.f.startdate.value,this.f.enddate.value */
    .subscribe(
        data => {
          if(data.status===1000)
          {
              this.openDialog("Promo Code Added","Ok");
               this.ngOnInit();
          }else
          {
            this.openDialog("Promo Code failed","Ok");
          }
          //this.router.navigate(['/products']);
        },
        error => {
          //this.loading = false;
        });
  }

  Delete()
  {
    this.promoservice.Deletepromo(this.promoid)
    .subscribe(
        data => {
          if(data.status===1000)
          {
            this.openDialog("Promo Code Deleted","Ok");
            this.ngOnInit();
          }else
          {
            this.openDialog("Promo Code Not Deleted","Ok");
            this.ngOnInit();
          }
          //this.router.navigate(['/products']);
        },
        error => {
          //this.loading = false;
        });
  }

  Process(detail:any)
  {
    
    this.isitemselected=true;
    this.registerfrmgrp.get('startdate').setValue(detail.promo_stdate);
    this.registerfrmgrp.get('enddate').setValue(detail.promo_enddate);
    this.registerfrmgrp.get('description').setValue(detail.promo_description);
    this.registerfrmgrp.get('promocode').setValue(detail.promo_code);
    this.registerfrmgrp.get('promocount').setValue(detail.promo_count);
    this.registerfrmgrp.get('discount').setValue(detail.promo_discount);
    this.registerfrmgrp.get('catdisp').setValue(detail.promo_cat);

 
    this.isitemselected=true;

    this.promoid=detail.promoid;
  }

  private listpromo = () => {

    this.promoservice.listpromo()
        .subscribe(
            data => {

              if(data.status===1000)
              {

                    this.MyDataSource = new MatTableDataSource();
                    this.MyDataSource.data = data.data;

              }else
              {

              }
              //this.router.navigate(['/products']);
            },
            error => {
              //this.loading = false;
            });
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
       // console.log('app.component.ts:140'+ result);

      }

    });
  }

   /* Scroll To */
   scrollto(el: HTMLElement)
   {
     el.scrollIntoView();
   }

}

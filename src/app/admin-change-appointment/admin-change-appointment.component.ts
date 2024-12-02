import { Component, OnInit, ViewChild,ElementRef  } from '@angular/core';
import { ResponseDetails } from 'src/models/resources/datum'
import { DatePipe } from '@angular/common';
import { AppSlotService } from 'src/services/appslot/appslot.service';
import { Router,ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-admin-change-appointment',
  templateUrl: './admin-change-appointment.component.html',
  styleUrls: ['./admin-change-appointment.component.css'],
  providers: [DatePipe]

})
export class AdminChangeAppointmentComponent implements OnInit{

    constructor(private appslotservice: AppSlotService,
      private route: ActivatedRoute,) { }
    showSpinner=false;
/*     @ViewChild('dateSelected') appdate:ElementRef; */
  
    public vltdataitem;
    selecteddate:string;
    isemptyslot_v:boolean;
    isonetofour_v : boolean;
    isemptyslot_c:boolean;
    isonetofour_c : boolean;
    datePipeEn: DatePipe = new DatePipe('en-US');
    calltype:string;
    docid : any;
    drName : string;
    drMName : string;
    SLOT_LIST_V : ResponseDetails[][];
    SLOT_LIST_C : ResponseDetails[][];
  
    clinicLoc: string;
    clinicID : number;
  
    noSlotsText : string;
    public displayDate : FormGroup;
    startDatePicker = new FormControl(new Date());
  
    ngOnInit() {
      this.displayDate = new FormGroup({
        startDatePicker: new FormControl('')
      });

      this.docid = this.route.snapshot.params['docid'];
      if(this.route.snapshot.params['drMName']){
        this.drName = this.route.snapshot.paramMap.get('drFName') +" "+this.route.snapshot.paramMap.get('drMName')+ " "+this.route.snapshot.paramMap.get('drLName');
      }else{
        this.drName = this.route.snapshot.paramMap.get('drFName') + " "+this.route.snapshot.paramMap.get('drLName');
      }
     
     // this.vltdataitem  = JSON.parse(sessionStorage.getItem('valitem'));
  
      this.selecteddate = this.datePipeEn.transform(this.startDatePicker.value,'yyyy-MM-dd');
/*       let dateValue = this.datePipeEn.transform(this.startDatePicker.value,'yyyy-MM-dd');//<HTMLInputElement>document.getElementById("dateSelected");
  
      dateValue = this.selecteddate; */
  
      this.vltdataitem  = JSON.parse(sessionStorage.getItem('valitem'));
    
     this.isemptyslot_v=true;
     this.isemptyslot_c=true;
     this.listappslot(this.datePipeEn.transform(this.selecteddate,'yyyy-MM-dd'),this.docid,'VIDEO');   
     this.listappslot(this.datePipeEn.transform(this.selecteddate,'yyyy-MM-dd'),this.docid,'CLINIC');   
    }
  
     /* Step 4 - Date change event */
     addEvent(change:string ,event: any)
     {
       this.selecteddate  = this.datePipeEn.transform(this.startDatePicker.value,'yyyy-MM-dd');
       this.listappslot(this.datePipeEn.transform(this.selecteddate,'yyyy-MM-dd'),this.docid,'VIDEO');   
       this.listappslot(this.datePipeEn.transform(this.selecteddate,'yyyy-MM-dd'),this.docid,'CLINIC');  
     }
     
     /* Step 4 - Displays app slots */
     private listappslot = (appdate:string,docdetid:number,calltype:string) => {
      this.appslotservice.GetApptAllSlots(appdate,docdetid,calltype,"admin")
          .subscribe(
              data => {
                if(data.status===1000){
                  if(data.data!==null && data.data!==undefined){
                    if(data.data.Allappslot!=null && data.data.Allappslot!==undefined){
                      if(calltype=="VIDEO")
                      {
                        this.SLOT_LIST_V=data.data.Allappslot;
                        this.isemptyslot_v=false;
                      }
                      else{
                        this.SLOT_LIST_C = data.data.Allappslot;
                        this.isemptyslot_c=false;
                        this.showSpinner=false;
                      }
                    }else{
                      this.noSlotsText = "The doctor is not available";
                      if(calltype=="VIDEO")
                      {
                        this.isemptyslot_v=true;
                      }
                      else{
                        this.isemptyslot_c=true;
                      }
                      this.showSpinner=false;
                    }
                  }
                }
                else{
                  if(data.status===1402)
                  {
                    let leave = data.data;
                    this.noSlotsText = "The doctor is not available "+leave;
                    if(calltype=="VIDEO")
                    {
                      this.isemptyslot_v=true;
                      this.showSpinner=false;
                    }
                    else{
                      this.clinicLoc = "Doctor is not available for in-clinic in this date. Please select another date.";
                      this.isemptyslot_c=true;
                      this.showSpinner=false;
                    }
                
                  }
                }
                //this.router.navigate(['/products']);
              },
              error => {
                this.showSpinner=false;
                //this.loading = false;
              });
    }
                  
  }

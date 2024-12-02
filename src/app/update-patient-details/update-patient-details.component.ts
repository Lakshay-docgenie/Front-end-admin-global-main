import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import data_state  from  'src/assets/state_list.json';
import city_list  from  'src/assets/city_list.json';
import age_list  from  'src/assets/age.json';
import lang_list  from  'src/assets/lang.json';
import height_list  from  'src/assets/height.json';
import weight_list  from  'src/assets/weight.json';
import bloodgrp_list  from  'src/assets/blood_group.json';
import { PatientService } from 'src/services/patient_details/patient.service';
import {PatientDetail} from 'src/models/patientlist/datum'
import { MatDialog } from '@angular/material/dialog';
import { MsgdialogComponent } from 'src/app/msgdialog/msgdialog.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DatePipe } from '@angular/common';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-update-patient-details',
  templateUrl: './update-patient-details.component.html',
  styleUrls: ['./update-patient-details.component.css']
})
export class UpdatePatientDetailsComponent implements OnInit {
  maxDate = new Date();
  datePipeEn: DatePipe = new DatePipe('en-IN');
  dateofbirth = new FormControl(new Date());
  birthString : string;
  screentitle:string;
  showSpinner:boolean;
  default : boolean;
  welcomeName : string;
  ispatient:boolean;
  imgurls = [];
  multipleImages = [];
  tmpgenter:string;
  patientList :PatientDetail[];
  withConsent:boolean;
  selfuser:boolean;
  public registerfrmgrp: FormGroup;
  selectedFood2: string;
  selectedFood3: string;
  city_content: string;
  data=data_state;
  city_list=city_list;
  age_list=age_list;
  lang_list=lang_list;
  height_list=height_list;
  weight_list=weight_list;
  bloodgrp_list=bloodgrp_list;
  genderlist: any[] = [
     'Male' ,
     'Female'
];

titlelist: any[] = [
   'Mr',
  'Mrs',
  'Ms'];

  imports:      [
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule 
  ]

  constructor(private router: Router,private userservice: PatientService,private dialog: MatDialog,private dateAdapter : DateAdapter<Date>) {
    this.dateAdapter.setLocale('en-GB'); }

  ngOnInit() {

    this.registerfrmgrp = new FormGroup({
      title: new FormControl(''),
      firstname: new FormControl('', [Validators.required, Validators.maxLength(45)]),
      lastname: new FormControl('', [Validators.required,Validators.maxLength(45)]),
      email: new FormControl('', [Validators.maxLength(100),Validators.email]),
      phonenumber: new FormControl('', [Validators.required,  Validators.pattern("^[0-9]*$"), Validators.minLength(10),Validators.maxLength(10)]),
      dateofbirth: new FormControl(''),
     // patage: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      preflang: new FormControl(''),
      state: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      postaladdress:  new FormControl('', Validators.minLength(5)),
      heightft: new FormControl(''),
      heightin: new FormControl(''),
      weight: new FormControl(''),
      bloodgrp: new FormControl('',),
      knownallg: new FormControl('',),
      pincode: new FormControl('', [Validators.pattern("^[0-9]*$"),Validators.minLength(6),Validators.maxLength(6)]),
      consert: new FormControl('',),
      image: new FormControl(),
      fileSource: new FormControl()
    });

    let vltdataitem  = JSON.parse(sessionStorage.getItem('valitem'));
    this.withConsent=false;
    this.welcomeName = vltdataitem.userfname+ " "+vltdataitem.userlname;
    if(vltdataitem.userrole === "patient")
    {
      this.screentitle= "Update your Personal Information";
      this.ispatient=true;
    }
    else
    {
      this.screentitle= "Patient Details"
      this.ispatient=false;
    }
    this.userservice.Patient_details_by_id(vltdataitem.patdetail.patdetid).subscribe(
      data => {
        //alert(data.msg);
        if(data.status==1000){
          this.patientList = data.data.ListPatDet;
          let vltdataitem  = JSON.parse(sessionStorage.getItem('valitem'));
          vltdataitem.patdetail = this.patientList[0];
          sessionStorage.setItem("valitem",JSON.stringify(vltdataitem));
          this.registerfrmgrp.get('title').setValue(this.patientList[0].patdet_title);
          this.registerfrmgrp.get('firstname').setValue(this.patientList[0].patdet_fname);
          this.registerfrmgrp.get('lastname').setValue(this.patientList[0].patdet_lname);
          this.registerfrmgrp.get('email').setValue(this.patientList[0].patdet_email);
          this.registerfrmgrp.get('phonenumber').setValue(this.patientList[0].patdet_contact);
          if(this.patientList[0].patdet_dob == null || this.patientList[0].patdet_dob == ""|| this.patientList[0].patdet_dob == "0000-00-00"){
            this.dateofbirth = new FormControl(new Date());
            this.birthString = "0000-00-00";
            //this.birthString = this.datePipeEn.transform(this.dateofbirth.value,"dd-MM-yyyy");
          }else{
            this.dateofbirth = new FormControl(new Date(this.patientList[0].patdet_dob));
            this.birthString = this.patientList[0].patdet_dob;
          }
          if(this.patientList[0].patdet_sex === 'M'){
            this.tmpgenter="Male";
          }else{
            this.tmpgenter="Female";
          }

          this.registerfrmgrp.get('gender').setValue(this.tmpgenter);
          this.registerfrmgrp.get('preflang').setValue(this.patientList[0].patdet_preflang);
          this.registerfrmgrp.get('state').setValue(this.patientList[0].patdet_state);
          //this.registerfrmgrp.get('city').setValue(this.patientList[0].patdet_city);

          this.city_content=city_list[this.patientList[0].patdet_state];
          this.selectedFood3 = this.patientList[0].patdet_city;
          this.registerfrmgrp.get('postaladdress').setValue(this.patientList[0].patdet_postadd);
          this.registerfrmgrp.get('pincode').setValue(this.patientList[0].patdet_pincode);
          this.registerfrmgrp.get('heightft').setValue(this.patientList[0].patdet_ht_ft);
          this.registerfrmgrp.get('heightin').setValue(this.patientList[0].patdet_ht_in);
          this.registerfrmgrp.get('weight').setValue(this.patientList[0].patdet_wt);
          this.registerfrmgrp.get('bloodgrp').setValue(this.patientList[0].patdet_bg);
          this.registerfrmgrp.get('knownallg').setValue(this.patientList[0].patdet_allergy);

          this.selfuser=true;
          this.registerfrmgrp.controls['firstname'].disable;
          this.registerfrmgrp.controls['lastname'].disable;
          this.registerfrmgrp.controls['email'].disable;

        }
        //this.router.navigate(['/products']);
      },
      error => {
        //this.router.navigate(['/home']);
      });
  }

  public hasError = (controlName: string, errorName: string) =>{
    return this.registerfrmgrp.controls[controlName].hasError(errorName);
  }
  public UpdatePatient = (ownerFormValue) => {
      if (this.registerfrmgrp.valid) {
      this.executeOwnerCreation(ownerFormValue);
    }
  }

  addEvent(change:string ,event: any)
  {   
    this.birthString = this.datePipeEn.transform(this.dateofbirth.value,"yyyy-MM-dd");
    this.registerfrmgrp.controls.dateofbirth.markAsDirty();
  }
  onFoodSelection2(selectedFood2) {
    this.city_content=city_list[selectedFood2];
    this.selectedFood3="";

  }
  onFoodSelection3(selectedFood3) {
    this.selectedFood3=selectedFood3;
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
  let pass = group.get('password').value;
  let confirmPass = group.get('confirmpassword').value;
  return pass === confirmPass ? null : { notSame: true }
  }

  get f() { return this.registerfrmgrp.controls; }

  private executeOwnerCreation = (ownerFormValue) => {
    let jsonItem  = JSON.parse(sessionStorage.getItem('valitem'));
    //let jsonData=JSON.parse(localStorage.getItem('user'));
    let id=jsonItem.patdetail.patdetid;
    let gender="";

    if(this.f.gender.value === 'Male'){
      gender="M";
    }else{
      gender="F";
    }
    this.userservice.UpdatePatientDetails(this.f.firstname.value, this.f.lastname.value,this.f.email.value,this.f.phonenumber.value,this.birthString,gender,this.f.preflang.value,this.f.state.value,this.f.city.value,this.f.postaladdress.value,this.f.heightft.value,this.f.heightin.value,this.f.weight.value,this.f.bloodgrp.value,this.f.knownallg.value,id,jsonItem.pattype,this.f.title.value,this.f.pincode.value)
        .subscribe(
            data => {
              if(data.status==1000){
                this.openDialog("Patient Details Updated","Ok");
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
   //localStorage.setItem('user', JSON.stringify(data.data));
   sessionStorage.setItem("valitem",JSON.stringify(vltdataitem));
    const dialogRef = this.dialog.open(MsgdialogComponent, {
      width: '300px',
      data: {},panelClass: 'my-panel'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
       // console.log('app.component.ts:140'+ result);



      //this.sharedService.chatMessageAdded.emit("logout")
      //this.router.navigate(['home']);
      }

    });
  }

  onDash():void{
    this.router.navigate(['/dashboard']);
  }

  divClose(){
    if(this.ispatient){
      this.router.navigate(['/dashboard']);
    }else{
      this.router.navigate(['/home']);
    }
    
  }

  onPersonalInformation():void{
    this.router.navigate(['/personal-information']);
  }
  
  onNewPat(){
    let vltdataitem  = JSON.parse(sessionStorage.getItem('valitem'));
    vltdataitem.pattype='FAMILY';
    sessionStorage.setItem("valitem",JSON.stringify(vltdataitem));
    this.router.navigate(['/register']);
  }

  onChangePat():void
  {
    this.router.navigate(['/change-patient']);
  }

  onPastAppPres()
  {
    this.router.navigate(['/patprofile']);
  }

  onPastLabTest()
  {
    this.router.navigate(['/past-lab-test']);
  }

  onPatFileList()
  {
    this.router.navigate(['/patfilelist']);
  }

  onMsgBox(){
    this.router.navigate(['/message-box']);
  }

  onHelpPat(){
    this.router.navigate(['/help-support']);
  }
  onVitals(){
    this.router.navigate(['/monitor-vitals']);
  }
  
}

import { Component , OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PatientService } from 'src/services/patient_details/patient.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { PatientDetail } from 'src/models/patientlist/datum'
/* import { ModelDeleteUserComponent } from 'src/app/dialog_delete_doctor/dialog-delete-user.component';
 */
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'app-admin-list-patient',
  templateUrl: './admin-list-patient.component.html',
  styleUrls: ['./admin-list-patient.component.css'],
  providers: [DatePipe]
})
export class AdminListPatientComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;   

  pgIndex= 2;
  firstLastButtons= true;
  pnDisabled= true;
  hdPageSize= true;

  public ownerForm: FormGroup;
  userrole:string;
  DOCTOR_LIST: PatientDetail[];
  MyDataSource: any;
  public registerfrmgrp: FormGroup;
  sort: MatSort;
  count : number;
  totalCount : number;
  loginID : number;

  constructor(private router: Router,
              private userservice: PatientService,public dialog: MatDialog) { }


  ngOnInit() {
    this.registerfrmgrp = new FormGroup({
      srchstr: new FormControl('',[Validators.required]),
    });
    let jsonItem  = JSON.parse(sessionStorage.getItem('valitem'));
    this.userrole = jsonItem.userrole
    if(this.userrole==="admin")
    {
      this.loginID = jsonItem.loginid;
      this.executeOwnerCreation();
    }
    
  }
  
  get f() { return this.registerfrmgrp.controls; }

  public hasError = (controlName: string, errorName: string) =>{
    return this.registerfrmgrp.controls[controlName].hasError(errorName);
  }

  onChangePage(pe:PageEvent) {
    //alert("PageIndex : "+pe.pageIndex+ " Page Size : " +pe.pageSize);
   }

  private executeOwnerCreation = () => {
        this.userservice.Patient_List(this.loginID, this.userrole)
        .subscribe(
            data => {
              if(data.status===1000)
              {
                this.MyDataSource = new MatTableDataSource();
               
                  this.MyDataSource.data = data.data.ListPatDet;
                  this.MyDataSource.sort = this.sort;
                  this.MyDataSource.paginator = this.paginator;
                  this.count = this.MyDataSource.data.length;
                  this.totalCount = this.count + 6822 + 4612 ;//(3919+217+543(Upto Feb 23)+52(Mar 23)+480(Apr-May23)+362(Jun-Jul23)+579(Aug-Oct23)+670(Nov23-Feb1124)+4612(Apr24-Jul24)
              }else{
                //console.log(data.msg);
              }
              //this.router.navigate(['/products']);
            },
            error => {
              //this.loading = false;
            });
  }

  search()
  {
    this.userservice.Patient_List_srchstr(this.f.srchstr.value,this.userrole)
    .subscribe(
        data => {
          if(data.status===1000){
            this.MyDataSource = new MatTableDataSource();
              this.MyDataSource.data = data.data.ListPatDet;
              this.MyDataSource.sort = this.sort;
              this.count = this.MyDataSource.data.length;
              this.MyDataSource.paginator = this.paginator;
          }else{
            //console.log(data.msg);
          }
          //this.router.navigate(['/products']);
        },
        error => {
          //alert(error.msg);
          //this.loading = false;
        });
  }
  

  /* handleClick_Delete(data: PatientDetail) {
    this.openDialog_Reset(data);
  } */

   handleClick_Edit(data: PatientDetail) {
    this.router.navigate(['/subform',data.login_loginid]);
   }

  /* openDialog_Reset(data: PatientDetail): void {
    const dialogRef = this.dialog.open(ModelDeleteUserComponent, {
      width: '300px',
      data: {name:data.patdet_fname,contact:data.patdet_contact,id:data.patdetid,loginid:data.login_loginid}
    });
    dialogRef.afterClosed().subscribe(result => {
      let content=JSON.stringify(result);
      let contentData=JSON.parse(content);
      if(contentData['clickStatus'] === 'yes'){
        const index = this.MyDataSource.data.indexOf(data);
        if(index!==-1){
        this.MyDataSource.data.splice(index, 1);
        this.MyDataSource._updateChangeSubscription(); // <-- Refresh the datasource
        }else{
          console.log('Delete failed');
        }
      }
    });
  }
 */
}


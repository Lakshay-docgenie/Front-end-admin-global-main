import { Component , OnInit,ViewChild  } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Datum } from 'src/models/doctorlist/datum'
import { Router } from '@angular/router';
import { DoctorService } from 'src/services/doctor_details/doctor.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';/* 
import { ModelDialogInactiveUser } from './dialog-inactive-user/dialog-inactive-user.component';
import { ModelDeleteUserComponent } from 'src/app/dialog_delete_doctor/dialog-delete-user.component';
 */
@Component({
  selector: 'app-child',
  templateUrl: './admin-list-doctor.component.html',
  styleUrls: ['./admin-list-doctor.component.css']
})
export class AdminListDoctor implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;   

  pgIndex= 2;
  firstLastButtons= true;
  pnDisabled= true;
  hdPageSize= true;

  public ownerForm: FormGroup;
  DOCTOR_LIST: Datum[];
  MyDataSource: any = [];
  public registerfrmgrp: FormGroup;
  count : number;
  drstatus : string;
  isASR : boolean;

  // Properties for filtering
  searchQuery: string = '';  // The query typed by the user
  filterField: string = 'name';  // The selected field to filter by

  constructor(private router: Router,
              private userservice: DoctorService,public dialog: MatDialog) { }


  ngOnInit() {
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
      srchstr: new FormControl('',[Validators.required]),
    });
    this.executeOwnerCreation();
    this.MyDataSource.filterPredicate = (data: any, filter: string) => {
      let searchTerm = filter.trim().toLowerCase();
      switch (this.filterField) {
        case 'name':
          return data.docdet_FullName.toLowerCase().includes(searchTerm);

        case 'language':
          return data.docdet_lang.toLowerCase().includes(searchTerm);

        case 'specialty':
          return data.docdet_special.toLowerCase().includes(searchTerm);

        default:
          return false; // No matching case
      }
    };
  }

  // Method to apply the filter based on the search query
  applyFilter() {
    this.MyDataSource.filter = this.searchQuery;
  }

  get f() { return this.registerfrmgrp.controls; }

  public hasError = (controlName: string, errorName: string) =>{
    return this.registerfrmgrp.controls[controlName].hasError(errorName);
  }

  private executeOwnerCreation = () => {
        this.userservice.Doctor_List("")
        .subscribe(
            data => {
              if(data){
                this.MyDataSource = new MatTableDataSource();
                this.MyDataSource.data = data.data.AllDocDet;
                this.count = this.MyDataSource.data.length;
                this.MyDataSource.paginator = this.paginator;
              }else{
               // alert(data.msg);
              }
              //this.router.navigate(['/products']);
            },
            error => {
              //this.loading = false;
            });
  }

  getcolor(status:string)
  {
    if(status=="ACTIVE")
    {
      this.drstatus = "Active";
      return "active"
    }
    else{
      this.drstatus = "Inactive";
      return "passive"
    }
  }

  getFUPStatus(status:string)
  {
    if(status == "Y"){
      return "Free Follow Up Enabled";
    }
  }
  
  Search()
  {
    this.userservice.Doctor_List(this.f.srchstr.value)
    .subscribe(

        data => {    
          if(data.status===1000)
          {
            if(data.data!==null && data.data!==undefined)
            {
              if(data.data.AllDocDet!=null && data.data.AllDocDet!==undefined){
                this.MyDataSource = new MatTableDataSource();
                this.MyDataSource.data = data.data.AllDocDet;
                this.count = this.MyDataSource.data.length;
                this.MyDataSource.paginator = this.paginator;
               }                 
            }
          }
          else
          {
            /* Nothing to display */
          }
        },
        error => {
          //this.showSpinner=false;
        });
  }

    /*  Clinic Location status */
    getstatus(clinic:string)
    {
      if (clinic=="Y")
      {
        return true;
      }
      else
      {
        return false;
      }
    }

  handleClick_Edit(data: Datum) {
    this.router.navigate(['/update_doctor',data.login_loginid]);
   }

  slotAvailabitity(docdetail : any){
    let docdetid = docdetail.docdetid;
    let drFName = docdetail.docdet_title+"."+docdetail.docdet_fname;
    let drMName = docdetail.docdet_mname;
    let drLName =  docdetail.docdet_lname;
   // this.router.navigate(['/update_doctor',data.login_loginid]);
   if(drMName !="" && drMName!=null){
    this.router.navigate(['/admin_list_slot',docdetid,drFName,drMName,drLName]);
   }else{
    this.router.navigate(['/admin_list_slot',docdetid,drFName,drLName]);
   }
  }

  onChangePage(pe:PageEvent) {
   /*  console.log(pe.pageIndex);
    console.log(pe.pageSize); */
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PatientService } from 'src/services/patient_details/patient.service';
import { DoctorService } from 'src/services/doctor_details/doctor.service';
import { SharedService } from 'src/app/shared.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { HttpClient} from '@angular/common/http';
import { UploadFileBody } from 'src/models/uploadFile/body';
import { MatDialog } from '@angular/material/dialog';
import { MsgdialogComponent } from 'src/app/msgdialog/msgdialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { docfiledet } from 'src/models/docfilelist/datum';
import { UserService } from 'src/services/users_list/userlist.service';

@Component({
  selector: 'app-add-doctor',
  templateUrl: './add-doctor.component.html',
  styleUrls: ['./add-doctor.component.css']
})
export class AddDoctorComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;   

  idDrSelected : boolean = false;
  isLastDrListed : boolean = false;
  selectedDoc:string;
  selectdocid:number;
  selectedSpl : string;
  selectedRegNo : string;
  selectedLoc : string;
  selectedPanNo : string;
  selectedAadhaarNo : string;
  docAgrDate : string;
  doclist;
  MyDataSource:any;
  count : number;
  DOCFILE_LIST: docfiledet[];

  pgIndex= 2;
  firstLastButtons= true;
  pnDisabled= true;
  hdPageSize= true;
  isUpload : boolean = true;
  isdummy:boolean=false;

  multipleImages = [];
  fileLength : string;
  fileTitle : string;
  showSpinner:boolean=false;

  configDoc = {
    displayKey: "custom",// custom values are passed, defined below :
    search: true,
    limitTo: 10,
    clearOnSelection:true,
    placeholder:'Select Doctor'
  };

  url : string;
  constructor(private router: Router,private patservice: PatientService,private doctorservice : DoctorService,
              private sharedserive:SharedService,
              private http: HttpClient,
              public dialog: MatDialog,
              private userService : UserService) { }

  ngOnInit() {
    if(this.selectdocid == undefined){
      this.selectdocid = 0;
    }
    this.userService.data$.subscribe(data => {
      this.url = data;
    });
    this.getDoctorList();
  }

  onDoctorSelection($event: any) {
    this.idDrSelected = true;
    let selectedDoctor = $event.value;
    this.selectedDoc = selectedDoctor.docdet_FullName;
    this.selectdocid = selectedDoctor.docdetid;
    this.selectedSpl = selectedDoctor.docdet_special;
    this.selectedRegNo = selectedDoctor.docdet_licnumber;
    this.selectedLoc = selectedDoctor.docdet_city;
    this.selectedPanNo = selectedDoctor.docdet_pan;
    this.selectedAadhaarNo = selectedDoctor.docdet_aadhar;
    this.docAgrDate = selectedDoctor.docdet_agrmtDate;
    if(this.selectdocid == 0){
      this.idDrSelected = false;
    }
    this.listDocFile();
  }

  private getDoctorList = () => {
    this.doctorservice.Doctor_OnBoardList(this.selectdocid)
    .subscribe(
        data => {
          if(data.status===1000){
            this.isLastDrListed = true;
            this.doclist = data.data.AllDocDet;
            this.showSpinner=false;

            //if we want to display more than one value in the drop-down, we can add it by creating custom value and add it like below
            for (let user of this.doclist) {
              user['custom'] = user.docdet_FullName + ' (' + user.docdet_cat + ')';
            }
          }else{
           this.isLastDrListed = false;           
          }                          
        },
        error => {
          //this.loading = false;
        });
  }

  onChangePage(pe:PageEvent) {
    //alert("PageIndex : "+pe.pageIndex+ " Page Size : " +pe.pageSize);
  }

  selectMultipleImage(event,method,docdetid)
  {
    this.isUpload = false;
    this.multipleImages = [];
    const file =  event.target.files.length;
    for(var i =  0; i <  event.target.files.length; i++)  
    {
      if (this.patservice.is4MBFileSize(event,i)) {
        this.openDialog_uppapp(event.target.files[i].name+" is over the size limit. Please upload files less than 4 MB","Ok");
      }else{
        this.multipleImages.push(event.target.files[i]);
      } 
    }
    this.onMultipleSubmit(method,docdetid);
  }

  onMultipleSubmit(method,docdetid)
  {
    this.showSpinner=true;
    const formData =  new  FormData();
    formData.append("docdetid", docdetid);
    formData.append("method", method);
    for  (var i =  0; i <  this.multipleImages.length; i++)  {
      formData.append("file[]",  this.multipleImages[i]);
    }
    this.http.post<UploadFileBody>(`${this.url}s3FileUploads/uploadDocFileS3.php`,formData)
      .subscribe(data => {
        this.showSpinner=false;
        if(data.status==1000){
          let fileUploaded = data.data.fileName;
          this.openDialog_uppapp("Files uploaded - "+fileUploaded,"Ok");
        }else{
          this.openDialog_uppapp("Sorry! File not uploaded.","Ok");
        }
    })
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
        this.isUpload = true;
        this.listDocFile();
      }
    });
  }

  doctorFullDetails(docdetail : any){
    let docdetid = docdetail.docdetid;
    let drName = docdetail.docdet_nm;
    this.doctorservice.setData(docdetail);//passing value from one component to another component
    this.router.navigate(['/doctor_full_details',docdetid,drName]);
  }

  onReport(reportName : string): void
  {
    window.open(`${this.url}s3FileUploads/doctorDocFile.php?reportName=${reportName}`); 
  }
  private listDocFile = () => {
    this.doctorservice.docctorFilesByID(this.selectdocid)
        .subscribe(
            data => {
              if(data.status===1000)
              {
                if(data.data!==null && data.data!==undefined)
                {
                  if(data.data.ListDocfileDet!=null && data.data.ListDocfileDet!==undefined)
                  {
                    this.MyDataSource = new MatTableDataSource();
                    this.MyDataSource.data = data.data.ListDocfileDet;
                    this.DOCFILE_LIST=data.data.ListDocfileDet;
                    this.isdummy=false;
                  }
                }
              }else
              {
                this.MyDataSource = [];
              }
              //this.router.navigate(['/products']);
            },
            error => {
              //this.loading = false;
            });
  }

  ondeletefile(fileDetail:any)
  {
    this.showSpinner = true;
    this.doctorservice.Delete_docFile(fileDetail.docfileid,fileDetail.docdetid,fileDetail.docfilesrc)
        .subscribe(
            data => {
              if(data.status===1000){
                this.showSpinner = false;
                this.openDialog_uppapp("\""+fileDetail.docfile_name+"\" - File deleted","Ok");
                this.listDocFile();
              }
            },
            error => {
              //this.loading = false;
            });
  }
}

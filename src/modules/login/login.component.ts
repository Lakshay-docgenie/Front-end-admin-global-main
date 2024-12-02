import { Component,EventEmitter,Output , OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { OtpService } from 'src/services/otp/otp.service';
import { SharedService } from 'src/app/shared.service';
import { MatDialog } from '@angular/material/dialog';
import {PatientDetail} from 'src/models/patientlist/datum';
import { vaultdata } from 'src/models/localstorage/vault';
import { MsgdialogComponent } from 'src/app/msgdialog/msgdialog.component';


@Component({
  selector: 'app-child',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  timeLeft: number = 59;
  btnText : string;
  interval;
  showSpinner:boolean=false;
  loginfailed:boolean=false;
  public userrole:string;
  public ownerForm: FormGroup;
  patdetid:string ;
  fromPage : string;
  isotpbtndisabled :boolean;
  patientAppList :PatientDetail[];

  @Output() postData = new EventEmitter();
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userservice: OtpService,
    private sharedserive:SharedService,
    private dialog: MatDialog,
    private title : Title) { }
    
  ngOnInit() 
  {
    let fromURL = this.route.snapshot.paramMap.get('from'); //Ramya -March 16 2021
    this.btnText = "Get OTP";
    this.isotpbtndisabled = false;
    this.title.setTitle("DocGenie | Admin Login");
    alert("Ravi:Test "+window.location.origin);
    this.ownerForm = new FormGroup({
      username: new FormControl('', [Validators.required,Validators.pattern("[0-9]{10}$")]),
      password: new FormControl('', [Validators.required])
    });
  
    if(fromURL == null){
      this.fromPage ='';
    }   
  }
  
  public generateOTP(ownerFormValue)
  {
    if (this.f.username.valid) {
      this.showSpinner = true;
      this.isotpbtndisabled = true;
      this.startTimer();
      this.genOTP();
    }
  }
  
  private genOTP()
  {
    this.userservice.generateopt(this.f.username.value)
            .subscribe(
                data => {
                  this.loginfailed=false;
                  if(data.status===1000)
                  {
                    let vltdataitem =  new vaultdata;
                    vltdataitem.userrole=data.data.otprole;
                    vltdataitem.token = data.data.otptoken;
                    this.patdetid=data.data.otpid;
                    this.userrole=data.data.otprole;
                    vltdataitem.msg={message:"",msgboxtype:""};
                    sessionStorage.setItem("valitem",JSON.stringify(vltdataitem));
                    this.showSpinner = false;
                  }
                  else
                  {
                    this.vaultDialog("Sorry! There is an error please contact helpdesk","Ok");
                  }
                },
                error => {
                  this.vaultDialog("Sorry! There is an error please contact helpdesk.","Ok");
                });
  }
  
  public hasError = (controlName: string, errorName: string) =>{
    return this.ownerForm.controls[controlName].hasError(errorName);
  }

  public LoginUser = (ownerFormValue) => {
  
    if (this.ownerForm.valid)
    {
      if(this.userrole=="NEWUSER")
      {
        this.vaultDialog("Sorry! There is an error please contact helpdesk.","Ok");
      }
      else
      {
        this.showSpinner = true;
        this.UserLogin(ownerFormValue);
      }
    }
  }
  
  get f() { return this.ownerForm.controls; }
    
  openDialog(lmsg:string,lmsgtype:string): void 
  {
    let vltdataitem = JSON.parse(sessionStorage.getItem('valitem'));//this.userservice.getDialog();
    vltdataitem.msg.message=lmsg;
    vltdataitem.msg.msgboxtype = lmsgtype;
    sessionStorage.setItem("valitem",JSON.stringify(vltdataitem));
    //this.userservice.setDialog(vltdataitem);
    const dialogRef = this.dialog.open(MsgdialogComponent, {
      width: '300px',
      data: {},panelClass: 'my-panel'
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if(result){
    
      }
  
    });
  }

  private UserLogin = (ownerFormValue) => {
    this.userservice.Login(this.f.username.value,this.f.password.value)
          .subscribe(
              data => {
                if(data.status===1000)
                {
                  if(data.data["userrole"] == 'admin' || data.data["userrole"] == 'ASR')
                  {
                    let vltdataitem =  new vaultdata;
                    vltdataitem.msg={message:"",msgboxtype:""};
                    vltdataitem.loginid = data.data["loginid"];
                    vltdataitem.loginname = data.data["username"];
                    vltdataitem.userrole = data.data["userrole"];
                    vltdataitem.userstatus = data.data["userstatus"];
                    vltdataitem.userfname= data.data['userfname'];
                    vltdataitem.userlname=data.data['userlname'];
                    vltdataitem.token = data.data["token"];
                    vltdataitem.patdetid = data.data["patdetid"];
                    //localStorage.setItem('user', JSON.stringify(data.data));
                    this.userservice.setUserData(JSON.stringify(data.data))
                    sessionStorage.setItem("valitem",JSON.stringify(vltdataitem));
                    
                    this.sharedserive.chatMessageAdded.emit("login")
                    this.showSpinner = false;
                    this.router.navigate(['/admin_list_appointments']);
                  }else{
                    this.vaultDialog("Invalid or Expired OTP, Please reach docgenie support","Ok");
                  }
                }
                else{
                  if(data.status===1206)
                  {
                    this.vaultDialog("Invalid or Expired OTP","Ok");
                  }
                }
                //this.router.navigate(['/products']);
              },
              error => {
                this.vaultDialog("Invalid or Expired OTP, Please reach docgenie support","Ok");
              });
  
    }
  
  vaultDialog(msgDialog : string, msgBoxTypeDialog : string)  {
    this.showSpinner=false;
    let vltdataitem =  new vaultdata;
    vltdataitem.msg={message:"",msgboxtype:""};
    sessionStorage.setItem("valitem",JSON.stringify(vltdataitem));
    //this.userservice.setDialog(vltdataitem);
    this.openDialog(msgDialog,msgBoxTypeDialog);
  }

  startTimer() 
  { 
    clearInterval(this.interval);
    this.timeLeft = 59;  
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
        this.btnText = "Resend OTP";
      } else {
        this.isotpbtndisabled = false;
      }
    },1000)
  }
  
  pauseTimer() {
    clearInterval(this.interval);
  }
  
}  
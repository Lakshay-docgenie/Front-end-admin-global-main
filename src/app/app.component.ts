import { Component,ViewChild, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSidenav } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { ModalLogoutComponent } from 'src/modules/modal-logout/modal-logout.component'; 
import { MsgdialogComponent  } from './msgdialog/msgdialog.component';
import { TermsandcondComponent } from './termsandcond/termsandcond.component';
import { PrivacyComponent} from './privacy/privacy.component';
import { NavItem } from './nav-item';
import { SharedService } from 'src/app/shared.service';
import { UserService } from 'src/services/users_list/userlist.service';
import { OtpService } from 'src/services/otp/otp.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit  {
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @ViewChild('sidenav') sidenav: MatSidenav;
  
  title = 'DocGenie';
  URLtext : string;
  notlogged : boolean = true;
  loginText : string; 
  loginImg : string;
  usermenu:boolean;
  adusermenu:boolean;
  asrmenu:boolean;
  drusermenu : boolean;
  patient : boolean;
  
  data: any;
  navItems: Array<NavItem> = [];
  viewcarttesttype:string;
  cartValue : number;

  constructor(private router: Router,
              public dialog: MatDialog,
              private sharedService:SharedService,
              private userService : UserService,
              private otpService : OtpService){
  /* During build the url needs to be pointed to docgenie apis so this needs to be changed during production build
     PROD-BUILD-DOCGENIE*/           
  //const serverURL = 'http://localhost:8081/';
  // const serverURL = 'http://localhost/';
  const serverURL = 'https://www.docgenie.in/apis/';
  //const serverURL = 'https://api.teledoctorgenie.com/apis/';
  
  //this.userService.setServerURL(serverURL); 
  this.userService.setData(serverURL);
  }

  ngOnInit() {

    this.usermenu=true;
    this.adusermenu=false;
    this.drusermenu = false;
    this.asrmenu=false;
    
    //ravi-Feb-19-st
    this.loginImg = "login.png";
    this.loginText = "Log In/Sign Up";

    this.sharedService.chatMessageAdded.subscribe((data) => {
      let content ;
      this.otpService.userdata$.subscribe(data => {
        content = data;
      });
      let jsonData = JSON.parse(content);
      this.data=jsonData;
      if(data === "login")
      { 
        this.menuForLoggedInUser();
      }else if(data === "logout")
      {
        this.openDialog();
      }
    });

     //------------------------------
     let jsonItem  = JSON.parse(sessionStorage.getItem('valitem'));
     let userData ;
     this.otpService.userdata$.subscribe(data => {
      if(data!= 'undefined'){
        userData = data;
      }else{
        userData = null;
      }
       
     });
     let jsonData = JSON.parse(userData);
     this.data = jsonData;
     let incomingURL = (window.location.href).replace('.html','');
     if(userData === null || jsonItem===null)
     {
       this.loginImg = "login.png";
       this.loginText = "Log In/Sign Up";
       this.menuForNotLoggedInUser();
       switch(true)
       {
         case incomingURL.includes('login'):
         {
           let parms = incomingURL.split('/');
           if(parms[4] != undefined){
             this.router.navigate(['/login',parms[4]]);
           }else{
             this.router.navigate(['/login']);
           }
           
           break;
         }
         default:
         {
           this.router.navigate(['/login']);
           break;
         }
       }
     }
     else
     {
       this.menuForLoggedInUser();
     }
  }

  menuForNotLoggedInUser(){
    this.usermenu=true;
    this.adusermenu=false;
    this.drusermenu = false;
    this.asrmenu=false;
  }

  menuForLoggedInUser()
  {
    this.navItems = [] as NavItem[];
    this.loginImg = "logout.png";
    this.loginText = "Log Out";
    if(this.data['userrole'] === "admin")
    {
      this.adusermenu = true;
      this.usermenu = false;
      this.drusermenu = false;
      this.patient = false;
      this.asrmenu=false;
    }
    if(this.data['userrole']==="ASR")
    {
      this.adusermenu = false;
      this.asrmenu=true;
      this.usermenu = false;
      this.drusermenu = false;
      this.patient = false;
    }
  }

  onLogoClick(){
    window.open(window.location.origin,'_blank');
  }

  onMenuClick(str:string): void
  {
    this.router.navigate([str]);
  }

  onLinkClick(str:string):void{
    window.open(window.location.origin+str, '_blank');
  }

  onBlogClick():void{
    window.open(window.location.origin+'/blogs','_blank');
  }
  
  onFeverClick():void{
    window.open(window.location.origin+'/doctor-for-fever');
  }

  onObesityClick():void{
    window.open(window.location.origin+'/obesity');
  }

  openMyMenu(menuTrigger: MatMenuTrigger) {
    menuTrigger.openMenu();
  }

  closeMyMenu(menuTrigger: MatMenuTrigger) {
    menuTrigger.closeMenu();
  }

  onLogClick():void{
    if(this.loginText=="Log Out"){
      this.openDialog();
    }else{
      this.onLogin();
    }
  }
  
  onLogin() : void{
    this.router.navigate(['/login']); 
    this.notlogged = false;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ModalLogoutComponent, {
      width: '300px',
      data: {},panelClass: 'my-panel'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
      sessionStorage.removeItem('valitem');
      sessionStorage.removeItem('doctorDetails');
      sessionStorage.removeItem('labcart');
      sessionStorage.removeItem('labtest');
      sessionStorage.removeItem('frompage');
      sessionStorage.removeItem('appdoc');
      sessionStorage.clear;
      this.loginImg = "login.png";
      this.loginText = "Log In/Sign Up";
      this.usermenu = true;
      this.drusermenu = false;
      this.adusermenu = false;
      this.patient = false;
      this.asrmenu=false;
      this.notlogged = true;
      this.cartValue = 0;
      this.router.navigate(['/login']);
      }

    });
  }

    //Onclicking the terms and Conditions link in the home page
    onTandCClick():void{
      const dialogRef = this.dialog.open(TermsandcondComponent, {
        width: '80%',height:'500px',
        data: {}
      });
    }
  
    //Onclicking the terms and Conditions link in the home page
    onPrivacyClick():void{
      const dialogRef = this.dialog.open(PrivacyComponent, {
        width: '80%',height:'500px',
        data: {}
      });
    }

}

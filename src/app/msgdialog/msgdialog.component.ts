import { Component, OnInit } from '@angular/core';
import { MatDialogRef} from '@angular/material/dialog';
import { OtpService } from 'src/services/otp/otp.service';

@Component({
  selector: 'app-msgdialog',
  templateUrl: './msgdialog.component.html',
  styleUrls: ['./msgdialog.component.css']
})
export class MsgdialogComponent implements OnInit {
  msg:string;
  isyesno:boolean;
  isok:boolean;
  constructor( public dialogRef: MatDialogRef<MsgdialogComponent>,
               private otpService : OtpService) { }

  ngOnInit(): void {
    this.isyesno = false;
    this.isok = false;
    let vltdataitem  = JSON.parse(sessionStorage.getItem('valitem'));/* this.otpService.getDialog();// */
    this.msg = vltdataitem.msg.message;
    if(vltdataitem.msg.msgboxtype==="YesNo")
    {
      this.isyesno = true;
    }
    if(vltdataitem.msg.msgboxtype==="Ok")
    {
      this.isok = true;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}


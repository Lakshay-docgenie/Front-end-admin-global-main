import { Component,Inject } from '@angular/core';
import { MatDialogRef} from '@angular/material/dialog';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DateAdapter } from '@angular/material/core';
import { labtestStatus } from 'src/models/labtest_listlabtest/datum'

interface labOrderData {
  clickStatus: string;
  caldetid : number;
  data : labtestStatus; 
}

@Component({
  selector: 'app-labtest-order',
  templateUrl: './labtest-order.component.html',
  styleUrls: ['./labtest-order.component.css']
})
export class LabtestOrderComponent {

  content: labOrderData;
  orderStatus : any;

  constructor(
    public dialogRef: MatDialogRef<LabtestOrderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: labOrderData,private dateAdapter : DateAdapter<Date>) {
      this.dateAdapter.setLocale('en-GB');
      this.content = data;
    }  

  ngOnInit(): void {     
    if(this.content.data)
    { 
      this.orderStatus = this.content.data;
    }
  }
   
  YesClick(): void {
    this.dialogRef.close();
  } 
}

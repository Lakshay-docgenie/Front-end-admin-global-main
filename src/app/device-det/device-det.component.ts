import { Component,Inject } from '@angular/core';
import { MatDialogRef} from '@angular/material/dialog';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DateAdapter } from '@angular/material/core';
import { Datum_doc } from 'src/models/docappoinments/datum';
import { MatTableDataSource } from '@angular/material/table';

interface DevicedetData {
  clickStatus: string;
  caldetid : number;
  data : Datum_doc; 
}
@Component({
  selector: 'app-device-det',
  templateUrl: './device-det.component.html',
  styleUrls: ['./device-det.component.css']
})
export class DeviceDetComponent {

  content: DevicedetData;
  MyDataSource:any;
 
  constructor(
    public dialogRef: MatDialogRef<DeviceDetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DevicedetData,private dateAdapter : DateAdapter<Date>) {
      this.dateAdapter.setLocale('en-GB');
      this.content = data;
    } 

  ngOnInit(): void {     
    if(this.content.data)
    { 
      this.MyDataSource = new MatTableDataSource();
      this.MyDataSource.data = this.content.data;
    }
  }
    
  YesClick(): void {
    this.dialogRef.close();
  }

}
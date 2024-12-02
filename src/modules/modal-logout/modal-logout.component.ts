import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef} from '@angular/material/dialog';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';

interface DialogData {
  email: string;
}

@Component({
  selector: 'app-modal-logout',
  templateUrl: './modal-logout.component.html',
  styleUrls: ['./modal-logout.component.css']
})
export class ModalLogoutComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ModalLogoutComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }
}

import { Component, OnInit, Inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-outlet-confirm',
    templateUrl: 'outlet-confirm.component.html',
})

export class OutletConfirmComponent {

  constructor(
    public dialogRef: MatDialogRef<OutletConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

import { Component, OnInit, Inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-biller-type-confirm',
    templateUrl: 'biller-type-confirm.component.html',
})

export class BillerTypeConfirmComponent {

  constructor(
    public dialogRef: MatDialogRef<BillerTypeConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

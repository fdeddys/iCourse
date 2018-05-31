import { Component, OnInit, Inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-biller-company-confirm',
    templateUrl: 'biller-company-confirm.component.html',
})

export class BillerCompanyConfirmComponent {

  constructor(
    public dialogRef: MatDialogRef<BillerCompanyConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

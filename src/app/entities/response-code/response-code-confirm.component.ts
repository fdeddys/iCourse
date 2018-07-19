import { Component, OnInit, Inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-response-code-confirm',
    templateUrl: 'response-code-confirm.component.html',
})

export class ResponseCodeConfirmComponent {

  constructor(
    public dialogRef: MatDialogRef<ResponseCodeConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

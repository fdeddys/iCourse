import { Component, OnInit, Inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-member-type-confirm',
    templateUrl: 'member-type-confirm.component.html',
})

export class MemberTypeConfirmComponent {

  constructor(
    public dialogRef: MatDialogRef<MemberTypeConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

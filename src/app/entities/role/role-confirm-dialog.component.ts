import { Component, OnInit, Inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-role-confirm-dialog',
    templateUrl: 'role-confirm-dialog.component.html',
})

export class RoleConfirmDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<RoleConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

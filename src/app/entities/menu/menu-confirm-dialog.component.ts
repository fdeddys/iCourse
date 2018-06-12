import { Component, OnInit, Inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-menu-confirm-dialog',
    templateUrl: 'menu-confirm-dialog.component.html',
})

export class MenuConfirmDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<MenuConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

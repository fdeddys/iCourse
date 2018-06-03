import { Component, OnInit, Inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-global-setting-confirm',
    templateUrl: 'global-setting-confirm.component.html',
})

export class GlobalSettingConfirmComponent {

  constructor(
    public dialogRef: MatDialogRef<GlobalSettingConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

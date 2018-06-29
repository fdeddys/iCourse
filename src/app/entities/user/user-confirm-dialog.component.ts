import { Component, OnInit, Inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-user-confirm-dialog',
    templateUrl: 'user-confirm-dialog.component.html',
})

export class UserConfirmDialogComponent {

    constructor(
        public dialogRef: MatDialogRef<UserConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    onNoClick(): void {
        this.dialogRef.close('close');
    }

    onClick(): void {
        const result = {
          'msg' : 'ok',
          'id': this.data.id
        };

        this.dialogRef.close(result);
    }

}

import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';

@Component({
    selector: 'app-transaction-list-export-dialog',
    templateUrl: 'transaction-list-export-dialog.component.html',
})
export class TransListExportDialogComponent {

    constructor(
        public dialogRef: MatDialogRef<TransListExportDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {}

    onNoClick(): void {
        this.dialogRef.close();
    }
}

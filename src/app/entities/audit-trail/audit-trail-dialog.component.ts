import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonValidatorDirective } from '../../validators/common.validator';
import { AuditTrail } from '.';

@Component({
    selector: 'app-member-type-dialog',
    templateUrl: './audit-trail-dialog.component.html',
    styleUrls: ['./audit-trail-dialog.component.css']
})

export class AuditTrailDialogComponent implements OnInit {

    auditTrail: AuditTrail;

    constructor(
        public snackBar: MatSnackBar,
        public dialogRef: MatDialogRef<AuditTrailDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
        this.auditTrail = this.data.audiTrail;
        console.log('isi audit trail ==> ', this.auditTrail);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }


}

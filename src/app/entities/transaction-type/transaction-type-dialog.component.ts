import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { TransType } from './transaction-type.model';
import { TransTypeService } from './transaction-type.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { CommonValidatorDirective } from '../../validators/common.validator';
import { SNACKBAR_DURATION_IN_MILLISECOND } from '../../shared/constant/base-constant';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-transaction-type-dialog',
    templateUrl: './transaction-type-dialog.component.html',
    styleUrls: ['./transaction-type-dialog.component.css']
})

export class TransTypeDialogComponent implements OnInit {
    transType: TransType;
    name: string;
    code: string;
    transTypeForm: FormGroup;
    submitted = false;
    duration = SNACKBAR_DURATION_IN_MILLISECOND;

    constructor(
        translate: TranslateService,
        private formBuilder: FormBuilder,
        public snackBar: MatSnackBar,
        public transTypeService: TransTypeService,
        public dialogRef: MatDialogRef<TransTypeDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        translate.use('en');
    }

    get form() { return this.transTypeForm.controls; }

    ngOnInit() {
        this.transTypeForm = this.formBuilder.group({
            name: ['', [CommonValidatorDirective.required]],
            code: ['', [CommonValidatorDirective.required]]
        });

        this.transType = {};
        if ( this.data.action === 'Edit' ) {
            // search
            this.transType = this.data.transType;
            this.name = this.transType.name;
            this.code = this.transType.code;
        }
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSubmit() {
        console.log('isi trans type = ', this.transType);
        // this.transType.name = this.name;

        if (this.transType.id === undefined) {
            console.log('send to service ', this.transType);
            // this.transType.id = null;
            this.transTypeService.create(this.transType)
                .subscribe(
                    (res: HttpResponse<TransType>) => {
                        console.log('masuk response ==>', this.transType);
                        if ( res.body.errMsg === null || res.body.errMsg === '' ) {
                            this.dialogRef.close('refresh');
                        } else {
                            this.openSnackBar(res.body.errMsg, 'Ok');
                        }
                    },
                    (res: HttpErrorResponse) => {
                        this.snackBar.open('Error !' + res.error.message , 'Close', {
                            duration: this.duration,
                        });
                        console.log('error msh ', res.error.message);
                    }
                );

        } else {
            console.log('send to service ', this.transType);
            this.transTypeService.update(this.transType.id, this.transType)
                .subscribe(
                    (res: HttpResponse<TransType>) => {
                        if ( res.body.errMsg === '' || res.body.errMsg === null ) {
                            this.dialogRef.close('refresh');
                        } else {
                            this.openSnackBar(res.body.errMsg, 'Ok');
                        }
                    },
                    (res: HttpErrorResponse) => {
                        this.snackBar.open('Error !' + res.error.message , 'Close', {
                            duration: 10000,
                        });
                        console.log('error msh ', res.error.message);
                    }
                );
        }
    }

    validate(): void {
        this.submitted = true;
        // stop here if form is invalid
        if (this.transTypeForm.invalid) {
            return;
        }
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: this.duration,
        });
    }
}

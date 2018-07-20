import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { ResponseCode } from './response-code.model';
import { ResponseCodeService } from './response-code.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { CommonValidatorDirective } from '../../validators/common.validator';
import { SNACKBAR_DURATION_IN_MILLISECOND } from '../../shared/constant/base-constant'; 
import { Member, MemberService } from '../member';

@Component({
    selector: 'app-response-code-dialog',
    templateUrl: './response-code-dialog.component.html',
    styleUrls: ['./response-code-dialog.component.css']
})

export class ResponseCodeDialogComponent implements OnInit {

    responseCode: ResponseCode;
    name: string;
    checked = false;
    responseCodeForm: FormGroup;
    submitted = false;
    duration = SNACKBAR_DURATION_IN_MILLISECOND;

    billPayTypeList = [];
    memberList = [];
    billerList = [];

    constructor(
        private formBuilder: FormBuilder,
        public responseCodeService: ResponseCodeService,
        public snackBar: MatSnackBar,
        public dialogRef: MatDialogRef<ResponseCodeDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    get form() { return this.responseCodeForm.controls; }

    ngOnInit() {
        this.responseCodeForm = this.formBuilder.group({
            billerHeaderId: ['', CommonValidatorDirective.required],
            responseCode: ['', CommonValidatorDirective.required],
            description: ['', CommonValidatorDirective.required]
        });
        this.responseCode = {};
        // this.responseCode.billPayType = false;
        if ( this.data.action === 'Edit' ) {
            // search
           // console.log('aaaaaaa', this.data);
            this.responseCode = this.data.responseCode;
            this.responseCode.billerHeaderId = this.data.responseCode.billerHeader.id;
        }
        this.billerList = this.data.billerData;

    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSubmit() {
        // this.responseCode.ispostpaid = this.checked  ;
        console.log('isi biller = ', this.responseCode);
        // this.responseCode.name = this.name;
        console.log('isi biller company ', this.responseCode);
        if (this.responseCode.id === undefined) {
            console.log('send to service ', this.responseCode);

            this.responseCodeService.create(this.responseCode)
                .subscribe((res: HttpResponse<ResponseCode>) => {
                    if (res.body.errMsg === '' || res.body.errMsg === null ) {
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

        } else {
            console.log('send to service ', this.responseCode);

            this.responseCodeService.update(this.responseCode.id, this.responseCode)
                .subscribe((res: HttpResponse<ResponseCode>) => {
                    if (res.body.errMsg === '' || res.body.errMsg === null ) {
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
        if (this.responseCodeForm.invalid) {
            return;
        }
    }

    onChange(events): void {
        console.log('event ', event);
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
          duration: this.duration,
        });
    }
}

import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { SNACKBAR_DURATION_IN_MILLISECOND } from '../../shared/constant/base-constant';
import { CommonValidatorDirective } from '../../validators/common.validator';
import { ResponseCode } from './response-code.model';
import { ResponseCodeService } from './response-code.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

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
    menuName = '';
    billPayTypeList = [];
    billerList = [];
    respCodeInternalList = [];

    constructor(
        translate: TranslateService,
        private formBuilder: FormBuilder,
        public responseCodeService: ResponseCodeService,
        public snackBar: MatSnackBar,
        public dialogRef: MatDialogRef<ResponseCodeDialogComponent>,
        private route: ActivatedRoute,
        @Inject(MAT_DIALOG_DATA) public data: any) {
            translate.setDefaultLang('en');
            translate.use('en');
         }

    get form() { return this.responseCodeForm.controls; }

    ngOnInit() {
        this.responseCodeForm = this.formBuilder.group({
            billerHeaderId: ['', CommonValidatorDirective.required],
            code: ['', CommonValidatorDirective.required],
            description: ['', CommonValidatorDirective.required],
            respCodeInternalId: ['', CommonValidatorDirective.required],
        });
        this.responseCode = {};
        // this.responseCode.billPayType = false;
        if ( this.data.action === 'Edit' ) {
            // search
            this.responseCode = this.data.responseCode;
            this.responseCode.billerHeaderId = this.data.responseCode.billerHeader.id;
            this.responseCode.respCodeInternalId = this.data.responseCode.responseCodeInternal;
            // console.log('aaaaaaa', this.responseCode);
        }
        this.billerList = this.data.billerData;
        this.respCodeInternalList = this.data.respCodeInternalData;
       // console.log('Masuk ', this.respCodeInternalList);

    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSubmit() {
        // this.responseCode.ispostpaid = this.checked  ;
        console.log('isi biller = ', this.responseCode.responseCode);
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

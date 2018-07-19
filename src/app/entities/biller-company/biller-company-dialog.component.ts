import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { BillerCompany } from './biller-company.model';
import { BillerCompanyService } from './biller-company.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { CommonValidatorDirective } from '../../validators/common.validator';
import { SNACKBAR_DURATION_IN_MILLISECOND } from '../../shared/constant/base-constant';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-biller-company-dialog',
    templateUrl: './biller-company-dialog.component.html',
    styleUrls: ['./biller-company-dialog.component.css']
})

export class BillerCompanyDialogComponent implements OnInit {

    billerCompany: BillerCompany;
    name: string;
    billerCompanyForm: FormGroup;
    submitted = false;
    duration = SNACKBAR_DURATION_IN_MILLISECOND;

    constructor(
        translate: TranslateService,
        private formBuilder: FormBuilder,
        public snackBar: MatSnackBar,
        public billerCompanyService: BillerCompanyService,
        public dialogRef: MatDialogRef<BillerCompanyDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
            translate.setDefaultLang('en');
            translate.use('en');
        }

    get form() { return this.billerCompanyForm.controls; }

    ngOnInit() {
        this.billerCompanyForm = this.formBuilder.group({
            name: ['', [CommonValidatorDirective.required]],
        });

        this.billerCompany = {};
        if ( this.data.action === 'Edit' ) {
            // search
            this.billerCompany = this.data.billerCompany;
            this.name = this.billerCompany.name;
        }

    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSubmit() {
        console.log('isi biller = ', this.billerCompany);
        // this.billerCompany.name = this.name;

        console.log('isi biller company ', this.billerCompany);
        if (this.billerCompany.id === undefined) {
            console.log('send to service ', this.billerCompany);
            this.billerCompanyService.create(this.billerCompany)
                .subscribe(
                    (res: HttpResponse<BillerCompany>) => {
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

        } else {
            console.log('send to service ', this.billerCompany);
            this.billerCompanyService.update(this.billerCompany.id, this.billerCompany)
                .subscribe(
                    (res: HttpResponse<BillerCompany>) => {
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
        if (this.billerCompanyForm.invalid) {
            return;
        }
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
          duration: this.duration,
        });
    }
}

import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { GlobalSetting } from './global-setting.model';
import { GlobalSettingService } from './global-setting.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { CommonValidatorDirective } from '../../validators/common.validator';
import { SNACKBAR_DURATION_IN_MILLISECOND } from '../../shared/constant/base-constant';

@Component({
    selector: 'app-global-setting-dialog',
    templateUrl: './global-setting-dialog.component.html',
    styleUrls: ['./global-setting-dialog.component.css']
})

export class GlobalSettingDialogComponent implements OnInit {

    globalSetting: GlobalSetting;
    globalSettingForm: FormGroup;
    submitted = false;
    duration = SNACKBAR_DURATION_IN_MILLISECOND;
    globalTypeOption = [
        {value: 'BANK', viewValue: 'Bank'},
        {value: 'RELIGION', viewValue: 'Religion'},
        {value: 'MEASUREMENT', viewValue: 'Measurement'}
    ];

    countries: string[] = ['USA', 'UK', 'Canada'];
    default: 'UK';

    constructor(
        private snackBar: MatSnackBar,
        private formBuilder: FormBuilder,
        public globalSettingService: GlobalSettingService,
        public dialogRef: MatDialogRef<GlobalSettingDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    get form() { return this.globalSettingForm.controls; }

    ngOnInit() {
        this.globalSettingForm = this.formBuilder.group({
             name: ['', [CommonValidatorDirective.required]],
             description: ['', CommonValidatorDirective.required]
         });

        this.globalSetting = {};
        if ( this.data.action === 'Edit' ) {
            // search
            console.log('member type id sending ', this.data.globalSetting);
            this.globalSetting = this.data.globalSetting;
        } else {
            this.globalSetting.globalType = 'BANK';
        }
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSubmit() {
        console.log('isi member  ', this.globalSetting);
        if (this.globalSetting.id === undefined) {
            console.log('send to service ', this.globalSetting);
            this.globalSettingService.create(this.globalSetting).subscribe((res: HttpResponse<GlobalSetting>) => {
                if (res.body.errMsg === '' || res.body.errMsg === null ) {
                    this.dialogRef.close('refresh');
                } else {
                    this.openSnackBar(res.body.errMsg, 'Ok');
                }
            });
        } else {
            console.log('send to service ', this.globalSetting);
            this.globalSettingService.update(this.globalSetting.id, this.globalSetting).subscribe((res: HttpResponse<GlobalSetting>) => {
                if (res.body.errMsg === '' || res.body.errMsg === null ) {
                    this.dialogRef.close('refresh');
                } else {
                    this.openSnackBar(res.body.errMsg, 'Ok');
                }
            });
        }
    }

    validate(): void {
        this.submitted = true;
        // stop here if form is invalid
        if (this.globalSettingForm.invalid) {
            return;
        }
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
          duration: this.duration,
        });
    }

}

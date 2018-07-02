import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GlobalSetting } from './global-setting.model';
import { GlobalSettingService } from './global-setting.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { CommonValidator } from '../../validators/common.validator';

@Component({
    selector: 'app-global-setting-dialog',
    templateUrl: './global-setting-dialog.component.html',
    styleUrls: ['./global-setting-dialog.component.css']
})

export class GlobalSettingDialogComponent implements OnInit {

    globalSetting: GlobalSetting;
    globalSettingForm : FormGroup;
    submitted = false;
    globalTypeOption = [
        {value: 'BANK', viewValue: 'Bank'},
        {value: 'RELIGION', viewValue: 'Religion'},
        {value: 'MEASUREMENT', viewValue: 'Measurement'}
    ];

    countries: string[] = ['USA', 'UK', 'Canada'];
    default: string = 'UK';
    
    constructor(
        
        private formBuilder: FormBuilder,
        public globalSettingService: GlobalSettingService,
        public dialogRef: MatDialogRef<GlobalSettingDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    get form() { return this.globalSettingForm.controls; }

    ngOnInit() {
        
        this.globalSettingForm = this.formBuilder.group({ 
             name: ['', [CommonValidator.required]],
             description: ['', CommonValidator.required]
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
                this.dialogRef.close('refresh');
            });
        } else {    
            console.log('send to service ', this.globalSetting);
            this.globalSettingService.update(this.globalSetting.id, this.globalSetting).subscribe((res: HttpResponse<GlobalSetting>) => {
                this.dialogRef.close('refresh');
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

}

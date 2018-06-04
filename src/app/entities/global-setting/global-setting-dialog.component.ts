import { Component, OnInit, Inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GlobalSetting } from './global-setting.model';
import { GlobalSettingService } from './global-setting.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-global-setting-dialog',
    templateUrl: './global-setting-dialog.component.html',
    styleUrls: ['./global-setting-dialog.component.css']
})

export class GlobalSettingDialogComponent implements OnInit {

    globalSetting: GlobalSetting;

    globalTypeOption = [
        {value: 'BANK', viewValue: 'Bank'},
        {value: 'RELIGION', viewValue: 'Religion'},
        {value: 'MEASUREMENT', viewValue: 'Measurement'}
    ];

    constructor(
        public globalSettingService: GlobalSettingService,
        public dialogRef: MatDialogRef<GlobalSettingDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
        this.globalSetting = {};
        if ( this.data.action === 'EDIT' ) {
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

    save(): void {

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

}

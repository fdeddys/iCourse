import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { OutletGroup } from './outlet-group.model';
import { OutletGroupService } from './outlet-group.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { CommonValidatorDirective } from '../../validators/common.validator';
import { SNACKBAR_DURATION_IN_MILLISECOND } from '../../shared/constant/base-constant';
import { SharedService } from '../../shared/services/shared.service';

@Component({
    selector: 'app-outlet-group-dialog',
    templateUrl: './outlet-group-dialog.component.html',
    styleUrls: ['./outlet-group-dialog.component.css']
})

export class OutletGroupDialogComponent implements OnInit {

    outletGroup: OutletGroup;
    name: string;
    checked = false;
    outletGroupForm: FormGroup;
    submitted = false;
    duration = SNACKBAR_DURATION_IN_MILLISECOND;

    constructor(
        private formBuilder: FormBuilder,
        public outletGroupService: OutletGroupService,
        public snackBar: MatSnackBar,
        public dialogRef: MatDialogRef<OutletGroupDialogComponent>,
        private sharedService: SharedService,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    get form() { return this.outletGroupForm.controls; }

    ngOnInit() {
        this.outletGroupForm = this.formBuilder.group({
            name: ['', [CommonValidatorDirective.required]],
            billPayTypeId : ['', [CommonValidatorDirective.required]]
        });
        this.outletGroup = {};
        if ( this.data.action === 'Edit' ) {
            // search
            this.outletGroup = this.data.OutletGroup;
            this.name = this.outletGroup.name;
        }
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSubmit() {

        if (this.outletGroup.id === undefined) {
            console.log('send to service ', this.outletGroup);

            this.outletGroupService.create(this.outletGroup)
                .subscribe((res: HttpResponse<OutletGroup>) => {
                    if (res.body.errCode === '' || res.body.errCode === null ) {
                        this.dialogRef.close('refresh');
                    } else {
                        this.openSnackBar(res.body.errDesc, 'Ok');
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
            console.log('send to service ', this.outletGroup);

            this.outletGroupService.update(this.outletGroup.id, this.outletGroup)
                .subscribe((res: HttpResponse<OutletGroup>) => {
                    if (res.body.errCode === '' || res.body.errCode === null ) {
                        this.dialogRef.close('refresh');
                    } else {
                        this.openSnackBar(res.body.errDesc, 'Ok');
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
        if (this.outletGroupForm.invalid) {
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

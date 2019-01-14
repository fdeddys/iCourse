import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Outlet } from './outlet.model';
import { OutletService } from './outlet.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { CommonValidatorDirective } from '../../validators/common.validator';
import { SNACKBAR_DURATION_IN_MILLISECOND } from '../../shared/constant/base-constant';
import { OutletGroupService } from '../outlet-group/outlet-group.service';
import { OutletGroup } from '../outlet-group';

@Component({
    selector: 'app-outlet-dialog',
    templateUrl: './outlet-dialog.component.html',
    styleUrls: ['./outlet-dialog.component.css']
})

export class OutletDialogComponent implements OnInit {

    outlet: Outlet;
    name: string;
    checked = false;
    outletForm: FormGroup;
    submitted = false;
    duration = SNACKBAR_DURATION_IN_MILLISECOND;
    outletGroup: OutletGroup;
    outletGroupList = [];
    groupOutlet: OutletGroup;

    constructor(
        private formBuilder: FormBuilder,
        public outletService: OutletService,
        public snackBar: MatSnackBar,
        public dialogRef: MatDialogRef<OutletDialogComponent>,
        private outletGroupService: OutletGroupService,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    get form() { return this.outletForm.controls; }

    ngOnInit() {
        this.outletForm = this.formBuilder.group({
            name: ['', [CommonValidatorDirective.required]],
            outletGroup: ['', [CommonValidatorDirective.required]],
            address1: ['', [CommonValidatorDirective.required]],
            address2: ['', [CommonValidatorDirective.required]],
        });
        this.outlet = {};
        this.outletGroupList = this.data.OutletGroupList;
        console.log('isi====>', this.data);
        if ( this.data.action === 'Edit' ) {
            // search
            this.outlet = {
                id : this.data.Outlet.id,
                address1 : this.data.Outlet.address1,
                address2 : this.data.Outlet.address2,
                groupOutletId : this.data.Outlet.groupOutlet.id,
                name : this.data.Outlet.name,
            };
            // this.name = this.outlet.name;
            // groupOutlet
            // this.groupOutlet = this.data.Outlet.groupOutlet;
            // console.log('aaaaaaaaa==>', this.groupOutlet);
        }
        // this.outletGroupService.filter({
        //     page: 0,
        //     count: 1000}
        // )
        // .subscribe(
        //         (res) => {
        //             this.outletGroupList = res.body;
        //         }
        // );

    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSubmit() {

        // this.outlet.groupOutletId = this.outletGroup.id;
        // this.outlet.groupOutlet = this.outletGroup;
        if (this.outlet.id === undefined) {
            console.log('send to service ', this.outlet);

            this.outletService.create(this.outlet)
                .subscribe((res: HttpResponse<Outlet>) => {
                    if (res.body.errCode === '00' ) {
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
            console.log('send to service ', this.outlet);

            this.outletService.update(this.outlet.id, this.outlet)
                .subscribe((res: HttpResponse<Outlet>) => {
                    if (res.body.errCode === '00' ) {
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
        if (this.outletForm.invalid) {
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

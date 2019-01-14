import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Classes } from './classes.model';
import { ClassesService } from './classes.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { CommonValidatorDirective } from '../../validators/common.validator';
import { SNACKBAR_DURATION_IN_MILLISECOND } from '../../shared/constant/base-constant';
import { SharedService } from '../../shared/services/shared.service';

@Component({
    selector: 'app-classes-dialog',
    templateUrl: './classes-dialog.component.html',
    styleUrls: ['./classes-dialog.component.css']
})

export class ClassesDialogComponent implements OnInit {

    classes: Classes;
    name: string;
    checked = false;
    classesForm: FormGroup;
    submitted = false;
    duration = SNACKBAR_DURATION_IN_MILLISECOND;
    statusList = [];

    constructor(
        private formBuilder: FormBuilder,
        public classesService: ClassesService,
        public snackBar: MatSnackBar,
        public dialogRef: MatDialogRef<ClassesDialogComponent>,
        private sharedService: SharedService,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    get form() { return this.classesForm.controls; }

    ngOnInit() {
        this.classesForm = this.formBuilder.group({
            name: ['', [CommonValidatorDirective.required]],
            billPayTypeId : ['', [CommonValidatorDirective.required]]
        });
        this.classes = {};
        if ( this.data.action === 'Edit' ) {
            // search
            this.classes = this.data.Classes;
            this.name = this.classes.name;
        }

        this.sharedService.getStatus()
            .subscribe(
                (res) => {
                    this.statusList = res.body;
                },
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { console.log('finally'); }
            );
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSubmit() {

        if (this.classes.id === undefined) {
            console.log('send to service ', this.classes);

            this.classesService.create(this.classes)
                .subscribe((res: HttpResponse<Classes>) => {
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
            console.log('send to service ', this.classes);

            this.classesService.update(this.classes.id, this.classes)
                .subscribe((res: HttpResponse<Classes>) => {
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
        if (this.classesForm.invalid) {
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

    private onError(error) {
        console.log('error..', error);
    }

}

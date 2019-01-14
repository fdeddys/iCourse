import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Room } from './room.model';
import { RoomService } from './room.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { CommonValidatorDirective } from '../../validators/common.validator';
import { SNACKBAR_DURATION_IN_MILLISECOND } from '../../shared/constant/base-constant';
import { SharedService } from '../../shared/services/shared.service';

@Component({
    selector: 'app-room-dialog',
    templateUrl: './room-dialog.component.html',
    styleUrls: ['./room-dialog.component.css']
})

export class RoomDialogComponent implements OnInit {

    room: Room;
    name: string;
    checked = false;
    outletGroupForm: FormGroup;
    submitted = false;
    duration = SNACKBAR_DURATION_IN_MILLISECOND;
    statusList = [];
    constructor(
        private formBuilder: FormBuilder,
        public roomService: RoomService,
        public snackBar: MatSnackBar,
        public dialogRef: MatDialogRef<RoomDialogComponent>,
        private sharedService: SharedService,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    get form() { return this.outletGroupForm.controls; }

    ngOnInit() {
        this.outletGroupForm = this.formBuilder.group({
            name: ['', [CommonValidatorDirective.required]]
        });
        this.room = {};
        if ( this.data.action === 'Edit' ) {
            // search
            this.room = this.data.Room;
            this.name = this.room.name;
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

        if (this.room.id === undefined) {
            console.log('send to service ', this.room);

            this.roomService.create(this.room)
                .subscribe((res: HttpResponse<Room>) => {
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
            console.log('send to service ', this.room);

            this.roomService.update(this.room.id, this.room)
                .subscribe((res: HttpResponse<Room>) => {
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

    private onError(error) {
        console.log('error..', error);
    }
}

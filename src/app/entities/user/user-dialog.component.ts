import { Component, OnInit, Inject } from '@angular/core';

import { FormsModule, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { User } from './user.model';
import { UserService } from './user.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-user-dialog',
    templateUrl: './user-dialog.component.html',
    styleUrls: ['./user-dialog.component.css']
})

export class UserDialogComponent implements OnInit {

    emailFormControl = new FormControl('', [
        Validators.required,
        Validators.email,
      ]);

    user: User;

    statuses = [
        {value: 1, viewValue: 'Active'},
        {value: 0, viewValue: 'Inactive'}
    ];

    constructor(
        public userService: UserService,
        public dialogRef: MatDialogRef<UserDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
        this.user = {};
        if ( this.data.action === 'EDIT' ) {
            // search
            console.log('id sending ', this.data.user);
            this.user = this.data.user;
        }
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    save(): void {

        console.log('isi object  ', this.user);
        if (this.user.id === undefined) {
            console.log('send to service ', this.user);
            this.userService.create(this.user).subscribe((res: HttpResponse<User>) => {
                this.dialogRef.close('refresh');
            });
        } else {
            console.log('send to service ', this.user);
            this.userService.update(this.user.id, this.user).subscribe((res: HttpResponse<User>) => {
                this.dialogRef.close('refresh');
            });
        }
    }

}

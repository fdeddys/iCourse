import { Component, OnInit, Inject } from '@angular/core';

import { FormsModule, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { User } from './user.model';
import { UserService } from './user.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-user-dialog',
    templateUrl: './user-dialog.component.html',
    styleUrls: ['./user-dialog.component.css']
})

export class UserDialogComponent implements OnInit {

    confirmP = '';
    pass = '';

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
        public snackBar: MatSnackBar,
        public dialogRef: MatDialogRef<UserDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
        this.user = {};
        if ( this.data.action === 'Edit' ) {
            // search
            console.log('id sending ', this.data.user);
            this.user = this.data.user;
        }
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    save(): void {
        // if ( this.data.action === 'Add' ) {

        //     if ( this.pass === '' ) {
        //         this.snackBar.open('Password belum di isi !', 'ok', {
        //             duration: 2000,
        //         });
        //         return ;
        //     }

        //     if ( this.pass !== this.confirmP ) {
        //         this.snackBar.open('Password dan confirmasi tidak sama !', 'ok', {
        //             duration: 2000,
        //         });
        //         return ;
        //     }
        //     this.user.password = atob(this.pass);
        // }

        this.user.password = this.pass;

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

import { Component, OnInit, Inject } from '@angular/core';

import { FormsModule, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { User } from './user.model';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { NO_DATA_GRID_MESSAGE, GRID_THEME, CSS_BUTTON } from '../../shared/constant/base-constant';
import { UserService } from './user.service';


@Component({
    selector: 'app-user-change-password',
    templateUrl: './user-update-password.component.html',
    styleUrls: []
})

export class UserUpdatePasswordComponent implements OnInit {

    confirmP = '';
    pass = '';
    oldpass = '';

    user: User;

    constructor(
        public userService: UserService,
        public snackBar: MatSnackBar,
        // public dialogRef: MatDialogRef<UserUpdatePasswordComponent>,
        // @Inject(MAT_DIALOG_DATA) public data: any
    ) { }


    ngOnInit() {
        this.userService.getCurrentUser()
            .subscribe(
                (res: HttpResponse<User>) => {
                    console.log('curr user ', res.body);
                    if ( res.body.errMsg === '' || res.body.errMsg === null ) {
                        this.user = res.body;
                    } else {
                        this.snackBar.open('User not found');
                    }
                },
                (err ) => {
                    console.log('Error', err);
                }
            );
    }

    // onNoClick(): void {
    //     this.dialogRef.close();
    // }

    save(): void {

        if ( this.oldpass === '' ) {
            this.snackBar.open('Old Password cannot blank');
            return ;
        }

        if ( this.pass === '' ) {
            this.snackBar.open('Password cannot blank');
            return ;
        }

        if ( this.confirmP === '' ) {
            this.snackBar.open('Password confirm cannot blank');
            return ;
        }

        if ( this.pass !== this.confirmP ) {
            this.snackBar.open('Password not match');
            return ;
        }
        console.log('send to service ', this.user);
        this.user.oldPass = btoa(this.oldpass) ;
        this.user.password = btoa(this.pass);
        this.userService.updatePassword(this.user).subscribe((res: HttpResponse<User>) => {
            if ( res.body.errMsg === '' || res.body.errMsg === null) {
                this.user = res.body;
                this.snackBar.open('Password change');
            } else {
                this.snackBar.open(res.body.errMsg);
            }
        });
    }

    cancel(): void {

    }

    // private onSuccess(data, headers) {

    // }

    // private onError(error) {
    //   console.log('error get all list role..');
    // }

}

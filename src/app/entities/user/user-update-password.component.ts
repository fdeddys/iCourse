import { Component, OnInit, Inject } from '@angular/core';

import { FormsModule, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { User } from './user.model';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { NO_DATA_GRID_MESSAGE, GRID_THEME, CSS_BUTTON } from '../../shared/constant/base-constant';


@Component({
    selector: 'app-user-change-password',
    templateUrl: './user-update-password.component.html',
    styleUrls: []
})

export class UserUpdatePasswordComponent implements OnInit {

    // confirmP = '';
    // pass = '';

    // user: User;

    // constructor(
    //     public userService: UserService,
    //     public snackBar: MatSnackBar,
    //     public dialogRef: MatDialogRef<UserUpdatePasswordComponent>,
    //     @Inject(MAT_DIALOG_DATA) public data: any) { }


    ngOnInit() {

    }

    // onNoClick(): void {
    //     this.dialogRef.close();
    // }

    // save(): void {

    //     this.user.password = '';
    //     console.log('send to service ', this.user);
    //     this.userService.update(this.user.id, this.user).subscribe((res: HttpResponse<User>) => {
    //         this.dialogRef.close('refresh');
    //     });
    // }

    // private onSuccess(data, headers) {

    // }

    // private onError(error) {
    //   console.log('error get all list role..');
    // }

}

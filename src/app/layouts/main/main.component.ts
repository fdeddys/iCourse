import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from '../../shared/login/login.service';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserUpdatePasswordComponent } from '../../entities/user/user-update-password.component';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class MainComponent {

    opened = true;
    menuTitle: string;

    constructor(
        private dialog: MatDialog,
        private loginService: LoginService,
        private router: Router
    ) { }

    onChangeMenu(name: string) {
        this.menuTitle = name;
        // console.log('title : ',this.menuTitle);
    }

    logout() {
        this.loginService.logout();
        // this.router.navigate(['']);
    }

    changePass(): void {
        // this.router.navigate(['change-pass']);

        const dialogRef = this.dialog.open(UserUpdatePasswordComponent, {
            width: '1000px',
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });
    }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from '../../shared/login/login.service';
import { MainService } from './main.service';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserUpdatePasswordComponent } from '../../entities/user/user-update-password.component';

import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
// import { Observable } from 'rxjs';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

    opened = true;
    menuTitle: string;

    // resizeColumn = new Observable();

    constructor(
        private mainService: MainService,
        private dialog: MatDialog,
        private loginService: LoginService,
        private router: Router,
        private localStorage: LocalStorageService,
        private sessionStorage: SessionStorageService
    ) {
        const token = this.localStorage.retrieve('token_id') || this.sessionStorage.retrieve('token_id');
        if (!token) {
            this.router.navigate(['']);
        }
    }

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

    resizeColumn() {
        console.log('resizeColumn from main..');
        this.mainService.resizeColumn();
    }

    ngOnInit() {
        // this.resizeColumn.subscribe(() => console.log('subscribe dari resize column..'));
    }

}

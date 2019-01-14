import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { LoginService } from './login.service';
import * as sha512 from 'js-sha512';
import { SharedService } from '../../shared/services/shared.service';
import {SNACKBAR_DURATION_IN_MILLISECOND } from '../../shared/constant/base-constant';
import {MatSnackBar } from '@angular/material';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    authenticationError: boolean;
    username: string;
    password: string;
    // rememberMe: boolean;
    langKey: string;

    credentials: any;

    hide: boolean;
    // userMenuArr: UserMenu[];
    duration = SNACKBAR_DURATION_IN_MILLISECOND;

    constructor(
        private loginService: LoginService,
        // private sidebarService: SideBarService,
        private sharedService: SharedService,
        private router: Router,
        public snackBar: MatSnackBar,
    ) {
        this.credentials = {
            username: null,
            password: null,
            rememberMe: true,
            langKey: 'EN'
        };
    }

    ngOnInit() {
        this.hide = true;
    }

    login() {
        console.log('login');
        // if (this.username === 'admin' && this.password === 'admin') {
        //     console.log('masuk admin..');
        //     this.router.navigate(['main']);
        // } else {
        //     alert('Invalid credentials');
        // }
       // alert(sha512(this.password));
       // alert(this.username.trim());

       if (this.username === null || this.username.trim() === '') {
        this.snackBar.open('Error ! Username is required' , 'Close', {
            duration: this.duration,
        });
        return;
       } else if (this.password == null || this.password.trim() === '') {
        this.snackBar.open('Error ! Password is required' , 'Close', {
            duration: this.duration,
        });
        return;
       } else {
        this.loginService.login({
            username: this.username,
            password: sha512(this.password),
           // password: this.password,
            langKey: this.langKey
        }).then((err) => {
            this.authenticationError = false;
            console.log('hasil login sucess');
            // if (this.router.url === '/register' || (/^\/activate\//.test(this.router.url)) ||
            //     (/^\/reset\//.test(this.router.url))) {
                // this.router.navigate(['']);
            // }

            // this.eventManager.broadcast({
            //     name: 'authenticationSuccess',
            //     content: 'Sending Authentication Success'
            // });

            // // previousState was set in the authExpiredInterceptor before being redirected to login modal.
            // // since login is succesful, go to stored previousState and clear previousState
            // const redirect = this.stateStorageService.getUrl();
            // if (redirect) {
            //     // this.stateStorageService.storeUrl(null);
            //     this.router.navigate([redirect]);
            // }

            this.router.navigate(['main']);

        }).catch((err) => {
            console.log('hasil login gagal ', err);
            // alert(err.status);
            if (err.status === 501) {
                this.snackBar.open('Error ! Account not registered' , 'Close', {
                    duration: this.duration,
                });
            } else if (err.status === 403) {
                this.snackBar.open('Error ! Invalid Setting role or menu ' , 'Close', {
                    duration: this.duration,
                });
            } else if (err.status === 401) {
                this.snackBar.open('Error ! Invalid Username or Password' , 'Close', {
                    duration: this.duration,
                });
            } else {
                this.snackBar.open('Error ! System Unavailable' , 'Close', {
                    duration: this.duration,
                });
            }
            this.authenticationError = true;
        });
       }

        console.log('selesai');
    }
}

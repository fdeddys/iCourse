import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { LoginService } from './login.service';
import * as sha512 from 'js-sha512';
import { SharedService } from '../../shared/services/shared.service';

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

    constructor(
        private loginService: LoginService,
        // private sidebarService: SideBarService,
        private sharedService: SharedService,
        private router: Router
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
        this.loginService.login({
            username: this.username,
            password: sha512(this.password),
           //password: this.password,
            langKey: this.langKey
        }).then(() => {
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
            this.authenticationError = true;
        });
        console.log('selesai');
    }
}

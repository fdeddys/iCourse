import { Injectable } from '@angular/core';

import { Principal } from '../auth/principal.service';
import { AuthServerProvider } from '../auth/auth-jwt.service';
import { Router } from '@angular/router';

@Injectable()
export class LoginService {

    constructor(
        // private languageService: JhiLanguageService,
        private principal: Principal,
        private router: Router,
        private authServerProvider: AuthServerProvider
    ) {}

    login(credentials, callback?) {
        const cb = callback || function() {};

        return new Promise((resolve, reject) => {
            this.authServerProvider.login(credentials).subscribe((data) => {
                // this.principal.identity(true).then((account) => {
                //     // After the login the language will be changed to
                //     // the language selected by the user during his registration
                //     // if (account !== null) {
                //     //     this.languageService.changeLanguage(account.langKey);
                //     // }
                //     resolve(data);
                // });
                console.log('hasil login isi resolve data ', data);

                this.router.navigate(['main']);

                // return cb();
            }, (err) => {
                console.log('hasil login gagal ', err);
                this.logout();
                reject(err);
                return cb(err);
            });
        });
    }

    loginWithToken(jwt, rememberMe) {
        console.log('loginWithToken');
        // return this.authServerProvider.loginWithToken(jwt, rememberMe);
    }

    logout() {
        console.log('logout..');
        // this.authServerProvider.logout().subscribe();
        // this.principal.authenticate(null);
    }
}

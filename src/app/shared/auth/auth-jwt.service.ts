import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalStorageService, SessionStorageService, SessionStorage } from 'ngx-webstorage';
import { AUTH_PATH } from '../../shared/constant/base-constant';

@Injectable()
export class AuthServerProvider {

    constructor(
        private http: HttpClient,
        private localStorage: LocalStorageService,
        private sessionStorage: SessionStorageService
    ) { }

    login(credentials): Observable<any> {

        const data = {
            username: credentials.username,
            password: credentials.password,
            rememberMe: credentials.rememberMe
        };
        return this.http.post(AUTH_PATH + 'authenticate', data, {observe : 'response'})
        .pipe(map(authenticateSuccess.bind(this)));

        function authenticateSuccess(resp ) {
            console.log('result from server ' , resp.body.id_token);
            const bearerToken = resp.headers.get('Authorization');
            if (bearerToken && bearerToken.slice(0, 7) === 'Bearer ') {
                console.log('masuk ke cek bearer token ');
                const jwt = bearerToken.slice(7, bearerToken.length);
                this.storeAuthenticationToken(jwt, credentials.rememberMe);
                return jwt;
            } else {
                const jwt = resp.body.id_token;
                this.localStorage.store('token_id', jwt);
                // this.sessionStorage.store('token_id', jwt);
                // SessionStorage.
                // this.storeAuthenticationToken(jwt, true);
                return jwt;
            }
        }
    }
}

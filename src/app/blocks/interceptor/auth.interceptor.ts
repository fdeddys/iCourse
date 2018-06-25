import { Observable } from 'rxjs';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
// import { SERVER_API_URL } from '../../app.constants';
import { SERVER } from '../../shared/constant/base-constant';

export class AuthInterceptor implements HttpInterceptor {

    private serverUrl = SERVER;

    constructor(
        private localStorage: LocalStorageService,
        private sessionStorage: SessionStorageService
    ) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log(request);

        // if (!request || !request.url || (/^http/.test(request.url) &&
        // !( this.serverUrl && request.url.startsWith(this.serverUrl)))) {
        //     return next.handle(request);
        // }
        const token = this.localStorage.retrieve('token_id') || this.sessionStorage.retrieve('token_id');
        // const token = this.localStorage.retrieve('authenticationToken') || this.sessionStorage.retrieve('authenticationToken');
        console.log('get token ' , token , '---');
        if (!!token) {
            console.log('inject token ', request.headers);
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        }
        console.log('isi request after inject', request.headers);
        return next.handle(request);
    }

}

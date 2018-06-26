import { Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginService } from '../../shared/login/login.service';

export class AuthExpiredInterceptor implements HttpInterceptor {

    constructor(
        private injector: Injector
    ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
        // .tap((event: HttpEvent<any>) => {}, (err: any) => {
        //     if (err instanceof HttpErrorResponse) {
        //         if (err.status === 401) {
        //             const loginService: LoginService = this.injector.get(LoginService);
        //             loginService.logout();
        //         }
        //     }
        // });
        .pipe(
            tap((event: HttpEvent<any>) => {}, (err: any) => {
                if (err instanceof HttpErrorResponse) {
                    if (err.status === 401) {
                        console.log('error 401 token expired..');
                        const loginService: LoginService = this.injector.get(LoginService);
                        loginService.logout();
                    }
                }
            })
        );
    }
}

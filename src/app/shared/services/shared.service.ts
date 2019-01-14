import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { SERVER_PATH } from '../../shared/constant/base-constant';
import { tap } from 'rxjs/operators';

@Injectable()
export class SharedService {
    private statusUtilUrl = SERVER_PATH + 'util/statuses';

    subscription = new Subject();

    private utilUrl = SERVER_PATH + 'util/';
    constructor(private http: HttpClient) { }
    setUserMenu(userMenuArr) {
        console.log('userMenuArr : ', userMenuArr);
        this.subscription.next(userMenuArr);
        // this.subscription.complete();
    }

    getUserMenu(): Observable<any> {
        console.log('trial get User Menu..');
        return this.subscription.asObservable();
    }

    getBillPayType(req?: any): Observable<HttpResponse<string[]>> {
        return this.http.get<string[]>(`${this.utilUrl}billpaytype`, { observe: 'response'})
        .pipe(
            tap(typeList => { })
        );
    }

    getStatus(req?: any): Observable<HttpResponse<string[]>> {
        return this.http.get<string[]>(`${this.statusUtilUrl}`, { observe: 'response'})
        .pipe(
            tap(status => { })
        );
    }

    getTypeGlobalSetting(req?: any): Observable<HttpResponse<string[]>> {
        return this.http.get<string[]>(`${this.utilUrl}globaltypelist`, { observe: 'response'})
        .pipe(
            tap(typeList => { })
        );
    }

    getCourseType(req?: any): Observable<HttpResponse<string[]>> {
        return this.http.get<string[]>(`${this.utilUrl}coursetype`, { observe: 'response'})
        .pipe(
            tap(typeList => { })
        );
    }

}

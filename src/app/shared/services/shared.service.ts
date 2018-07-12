import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { SERVER_PATH } from '../constant/base-constant';
import { tap } from 'rxjs/internal/operators/tap';

@Injectable()
export class SharedService {
    private statusUtilUrl = SERVER_PATH + 'util/statuses';

    subscription = new Subject();

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

    getStatus(req?: any): Observable<HttpResponse<string[]>> {
        return this.http.get<string[]>(`${this.statusUtilUrl}`, { observe: 'response'})
        .pipe(
            tap(status => { })
        );
    }

}

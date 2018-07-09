import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { tap } from 'rxjs/operators';

import { UserMenu } from './usermenu.model';
import { createRequestOption } from '../../shared/model/request-util';
import { SERVER_PATH } from '../../shared/constant/base-constant';

@Injectable()
export class SideBarService {
    private resourceUrl = SERVER_PATH + 'menu';

    constructor(private http: HttpClient) { }

    query(userName?: any): Observable<HttpResponse<UserMenu[]>> {
        return this.http.get<UserMenu[]>(`${this.resourceUrl}/usermenu/${userName}`, {  observe: 'response' })
        .pipe(
            tap(result => console.log('raw ', result ))
        );
    }

    queryMenu(): Observable<HttpResponse<UserMenu[]>> {
        return this.http.get<UserMenu[]>(`${this.resourceUrl}/listusermenu`, {  observe: 'response' })
        .pipe(
            tap(result => console.log('raw ', result ))
        );
    }
}

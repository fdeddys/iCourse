import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SERVER_PATH } from '../constant/base-constant';

@Injectable()
export class AccountService  {
    constructor(private http: HttpClient) { }

    get(): Observable<HttpResponse<Account>> {
        return this.http.get<Account>(SERVER_PATH + 'account', {observe : 'response'});
    }

    save(account: any): Observable<HttpResponse<any>> {
        return this.http.post(SERVER_PATH + 'account', account, {observe: 'response'});
    }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { tap } from 'rxjs/operators';

import { RoleUserView } from './role-user.model';
import { createRequestOption } from '../../shared/model/request-util';
import { SERVER_PATH } from '../../shared/constant/base-constant';

export type EntityResponseType = HttpResponse<RoleUserView>;

@Injectable()
export class RoleUserService {

private resourceUrl = SERVER_PATH + 'roleuser';

    constructor(private http: HttpClient) { }

    query(userId?: any): Observable<HttpResponse<RoleUserView[]>> {

        return this.http.get<RoleUserView[]>(`${this.resourceUrl}/user/${userId}/listrole`, {  observe: 'response' })
        .pipe(
            tap(result => console.log('raw ', result ))
        );

    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: RoleUserView = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<RoleUserView[]>): HttpResponse<RoleUserView[]> {
        const jsonResponse: RoleUserView[] = res.body;
        const body: RoleUserView[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Role.
     */
    private convertItemFromServer(role: RoleUserView): RoleUserView {
        const copy: RoleUserView = Object.assign({}, role);
        return copy;
    }

    /**
     * Convert a Role to a JSON which can be sent to the server.
     */
    private convert(role: RoleUserView): RoleUserView {
        const copy: RoleUserView = Object.assign({}, role);
        return copy;
    }
}

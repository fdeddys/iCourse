import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { tap } from 'rxjs/operators';

import { RoleMenu } from './role-menu.model';
import { createRequestOption } from '../../shared/model/request-util';
import { SERVER_PATH } from '../../shared/constant/base-constant';

export type EntityResponseType = HttpResponse<RoleMenu>;

@Injectable()
export class RoleMenuService {

private resourceUrl = SERVER_PATH + 'rolemenu';

    constructor(private http: HttpClient) { }


    create(role: RoleMenu): Observable<EntityResponseType> {
        const copy = this.convert(role);
        return this.http.post<RoleMenu>(`${this.resourceUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    update(id: number, role: RoleMenu): Observable<EntityResponseType> {
        const copy = this.convert(role);
        return this.http.put<RoleMenu>(`${this.resourceUrl}/${id}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: RoleMenu = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<RoleMenu[]>): HttpResponse<RoleMenu[]> {
        const jsonResponse: RoleMenu[] = res.body;
        const body: RoleMenu[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Role.
     */
    private convertItemFromServer(role: RoleMenu): RoleMenu {
        const copy: RoleMenu = Object.assign({}, role);
        return copy;
    }

    /**
     * Convert a Role to a JSON which can be sent to the server.
     */
    private convert(role: RoleMenu): RoleMenu {
        const copy: RoleMenu = Object.assign({}, role);
        return copy;
    }
}

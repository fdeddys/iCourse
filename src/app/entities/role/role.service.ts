import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { tap } from 'rxjs/operators';

import { Role, RoleMenuView } from './role.model';
import { createRequestOption } from '../../shared/model/request-util';
import { SERVER_PATH, REPORT_PATH } from '../../shared/constant/base-constant';

export type EntityResponseType = HttpResponse<Role>;

@Injectable()
export class RoleService {

    private resourceUrl = SERVER_PATH + 'role';
    private reportUrl = REPORT_PATH;

    constructor(private http: HttpClient) { }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Role>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    query(req?: any): Observable<HttpResponse<Role[]>> {
        const options = createRequestOption(req);
        let pageNumber = null;
        let pageCount = null;
        let newresourceUrl = null;
        Object.keys(req).forEach((key) => {
            if (key === 'page') {
                pageNumber = req[key];
            }
            if (key === 'count') {
                pageCount = req[key];
            }
        });

        if (pageNumber !== null ) {
            newresourceUrl = this.resourceUrl + `/page/${pageNumber}/count/${pageCount}`;
            return this.http.get<Role[]>(newresourceUrl, { observe: 'response' })
            .pipe(
                tap(role => console.log('raw ', role ))
            );
        } else {
            return this.http.get<Role[]>(`${this.resourceUrl}`, {  observe: 'response' })
            .pipe(
                tap(role => console.log('raw ', role ))
            );
        }
    }

    create(role: Role): Observable<EntityResponseType> {
        const copy = this.convert(role);
        return this.http.post<Role>(`${this.resourceUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    update(id: number, role: Role): Observable<EntityResponseType> {
        const copy = this.convert(role);
        return this.http.put<Role>(`${this.resourceUrl}/${id}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    changeActivation(roleid: number, menuid: number): Observable<EntityResponseType> {
        return this.http.put<null>(`${this.resourceUrl}/${roleid}/menu/${menuid}`, null , { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    // changeActivation2(roleid: number, menuid: number): Promise<EntityResponseType> {
    //     return this.http.get<null>(`${this.resourceUrl}/role/${roleid}/menu/${menuid}`, null )
    //         .toPromise()
    //         .then(
    //             res => {}
    //         );
    // }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Role = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Role[]>): HttpResponse<Role[]> {
        const jsonResponse: Role[] = res.body;
        const body: Role[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Role.
     */
    private convertItemFromServer(role: Role): Role {
        const copy: Role = Object.assign({}, role);
        return copy;
    }

    /**
     * Convert a Role to a JSON which can be sent to the server.
     */
    private convert(role: Role): Role {
        const copy: Role = Object.assign({}, role);
        return copy;
    }

    async exportCSV(): Promise<Blob> {
        const file =  await this.http.get<Blob>(
            `${this.reportUrl}role/csv`,
            {responseType: 'blob' as 'json'}
        ).toPromise();
        return file;
    }

}

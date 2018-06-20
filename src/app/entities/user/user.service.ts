import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { tap } from 'rxjs/operators';

import { User } from './user.model';
import { createRequestOption } from '../../shared/model/request-util';
import { SERVER_PATH } from '../../shared/constant/base-constant';

export type EntityResponseType = HttpResponse<User>;

@Injectable()
export class UserService {

private resourceUrl = SERVER_PATH + 'user';

    constructor(private http: HttpClient) { }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<User>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    query(req?: any): Observable<HttpResponse<User[]>> {
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
            return this.http.get<User[]>(newresourceUrl, { observe: 'response' })
            .pipe(
                tap(user => console.log('raw ', user ))
            );
        } else {
            return this.http.get<User[]>(`${this.resourceUrl}`, {  observe: 'response' })
            .pipe(
                tap(user => console.log('raw ', user ))
            );
        }
    }

    create(user: User): Observable<EntityResponseType> {
        const copy = this.convert(user);
        return this.http.post<User>(`${this.resourceUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    update(id: number, user: User): Observable<EntityResponseType> {
        const copy = this.convert(user);
        return this.http.put<User>(`${this.resourceUrl}/${id}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    addRole(userId: number, roleId: number): Observable<EntityResponseType> {
        return this.http.post<User>(`${this.resourceUrl}/${userId}/role/${roleId}`, null, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    changeStatusRole(userId: number, roleId: any): Observable<EntityResponseType> {
        return this.http.put(`${this.resourceUrl}/${userId}/role/${roleId}/changeStatus`, null, { observe : 'response'})
            .pipe(
                map((res: EntityResponseType) => this.convertResponse(res))
            );
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: User = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<User[]>): HttpResponse<User[]> {
        const jsonResponse: User[] = res.body;
        const body: User[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to User.
     */
    private convertItemFromServer(user: User): User {
        const copy: User = Object.assign({}, user);
        return copy;
    }

    /**
     * Convert a User to a JSON which can be sent to the server.
     */
    private convert(user: User): User {
        const copy: User = Object.assign({}, user);
        return copy;
    }
}

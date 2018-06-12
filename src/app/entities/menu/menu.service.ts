import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { tap } from 'rxjs/operators';

import { Menu } from './menu.model';
import { createRequestOption } from '../../shared/model/request-util';
import { SERVER_PATH } from '../../shared/constant/base-constant';
import { RoleMenuView } from '../role';

export type EntityResponseType = HttpResponse<Menu>;

@Injectable()
export class MenuService {

private resourceUrl = SERVER_PATH + 'menu';

    constructor(private http: HttpClient) { }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Menu>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    query(req?: any): Observable<HttpResponse<Menu[]>> {
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
            return this.http.get<Menu[]>(newresourceUrl, { observe: 'response' })
            .pipe(
                tap(menu => console.log('raw ', menu ))
            );
        } else {
            return this.http.get<Menu[]>(`${this.resourceUrl}`, {  observe: 'response' })
            .pipe(
                tap(menu => console.log('raw ', menu ))
            );
        }
    }

    findByRole(idrole?: any): Observable<HttpResponse<RoleMenuView[]>> {

        return this.http.get<RoleMenuView[]>(this.resourceUrl + `/role/${idrole}`, { observe: 'response' })
        .pipe(
            tap(menu => console.log('raw ', menu ))
        );
    }

    create(menu: Menu): Observable<EntityResponseType> {
        const copy = this.convert(menu);
        return this.http.post<Menu>(`${this.resourceUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    update(id: number, menu: Menu): Observable<EntityResponseType> {
        const copy = this.convert(menu);
        return this.http.put<Menu>(`${this.resourceUrl}/${id}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Menu = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Menu[]>): HttpResponse<Menu[]> {
        const jsonResponse: Menu[] = res.body;
        const body: Menu[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Menu.
     */
    private convertItemFromServer(menu: Menu): Menu {
        const copy: Menu = Object.assign({}, menu);
        return copy;
    }

    /**
     * Convert a Menu to a JSON which can be sent to the server.
     */
    private convert(menu: Menu): Menu {
        const copy: Menu = Object.assign({}, menu);
        return copy;
    }
}

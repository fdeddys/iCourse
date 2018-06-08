import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { tap } from 'rxjs/operators';

import { Biller } from './biller.model';
import { createRequestOption } from '../../shared/model/request-util';
import { SERVER_PATH } from '../../shared/constant/base-constant';

export type EntityResponseType = HttpResponse<Biller>;

@Injectable()
export class BillerService {

private resourceUrl = SERVER_PATH + 'registration';

    constructor(private http: HttpClient) { }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Biller>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    query(req?: any): Observable<HttpResponse<Biller[]>> {
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
            return this.http.get<Biller[]>(newresourceUrl, { observe: 'response' })
            .pipe(
                tap(biller => console.log('raw ', biller ))
            );
        } else {
            return this.http.get<Biller[]>(`${this.resourceUrl}`, {  observe: 'response' })
            .pipe(
                tap(biller => console.log('raw ', biller ))
            );
        }
    }

    create(biller: Biller): Observable<EntityResponseType> {
        const copy = this.convert(biller);
        return this.http.post<Biller>(`${this.resourceUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    update(id: number, biller: Biller): Observable<EntityResponseType> {
        const copy = this.convert(biller);
        return this.http.put<Biller>(`${this.resourceUrl}/${id}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Biller = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Biller[]>): HttpResponse<Biller[]> {
        const jsonResponse: Biller[] = res.body;
        const body: Biller[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Biller.
     */
    private convertItemFromServer(biller: Biller): Biller {
        const copy: Biller = Object.assign({}, biller);
        return copy;
    }

    /**
     * Convert a Biller to a JSON which can be sent to the server.
     */
    private convert(biller: Biller): Biller {
        const copy: Biller = Object.assign({}, biller);
        return copy;
    }
}

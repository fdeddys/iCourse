import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { tap } from 'rxjs/operators';

import { BillerDetail } from './biller-detail.model';
import { createRequestOption } from '../../shared/model/request-util';

export type EntityResponseType = HttpResponse<BillerDetail>;

@Injectable()
export class BillerDetailService {

    private resourceUrl =  'http://localhost:8080/api/detilbiller';

    constructor(private http: HttpClient) { }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<BillerDetail>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    query(req?: any): Observable<HttpResponse<BillerDetail[]>> {
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
            newresourceUrl = this.resourceUrl + `/idhdr/${req['idhdr']}/page/${pageNumber}/count/${pageCount}`;
            return this.http.get<BillerDetail[]>(newresourceUrl, { observe: 'response' })
            .pipe(
                tap(billerDetail => console.log('raw ', billerDetail ))
            );
        } else {
            return this.http.get<BillerDetail[]>(`${this.resourceUrl}`, {  observe: 'response' })
            .pipe(
                tap(billerDetail => console.log('raw ', billerDetail ))
            );
        }
    }

    create(billerDetail: BillerDetail): Observable<EntityResponseType> {
        const copy = this.convert(billerDetail);
        return this.http.post<BillerDetail>(`${this.resourceUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    update(id: number, billerDetail: BillerDetail): Observable<EntityResponseType> {
        const copy = this.convert(billerDetail);
        return this.http.put<BillerDetail>(`${this.resourceUrl}/${id}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: BillerDetail = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<BillerDetail[]>): HttpResponse<BillerDetail[]> {
        const jsonResponse: BillerDetail[] = res.body;
        const body: BillerDetail[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Biller.
     */
    private convertItemFromServer(billerDetail: BillerDetail): BillerDetail {
        const copy: BillerDetail = Object.assign({}, billerDetail);
        return copy;
    }

    /**
     * Convert a Biller to a JSON which can be sent to the server.
     */
    private convert(billerDetail: BillerDetail): BillerDetail {
        const copy: BillerDetail = Object.assign({}, billerDetail);
        return copy;
    }
}

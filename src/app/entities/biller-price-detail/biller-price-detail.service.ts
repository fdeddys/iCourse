import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { tap } from 'rxjs/operators';

import { BillerPriceDetail } from './biller-price-detail.model';
import { createRequestOption } from '../../shared/model/request-util';
import { SERVER_PATH } from '../../shared/constant/base-constant';

export type EntityResponseType = HttpResponse<BillerPriceDetail>;

@Injectable()
export class BillerPriceDetailService {

    private resourceUrl =  SERVER_PATH + 'detilnonbiller';

    constructor(private http: HttpClient) { }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<BillerPriceDetail>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    query(req?: any): Observable<HttpResponse<BillerPriceDetail[]>> {
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
            return this.http.get<BillerPriceDetail[]>(newresourceUrl, { observe: 'response' })
            .pipe(
                tap(billerPriceDetail => console.log('raw ', billerPriceDetail ))
            );
        } else {
            return this.http.get<BillerPriceDetail[]>(`${this.resourceUrl}`, {  observe: 'response' })
            .pipe(
                tap(billerPriceDetail => console.log('raw ', billerPriceDetail ))
            );
        }
    }

    getListBiller(id: number): Observable<EntityResponseType> {
        // /api/billerproduct/{idproduct}/listBiller
        return this.http.get<BillerPriceDetail>(`${SERVER_PATH}billerproduct/${id}/listBiller`, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    create(billerPriceDetail: BillerPriceDetail): Observable<EntityResponseType> {
        const copy = this.convert(billerPriceDetail);
        return this.http.post<BillerPriceDetail>(`${this.resourceUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    update(id: number, billerPriceDetail: BillerPriceDetail): Observable<EntityResponseType> {
        const copy = this.convert(billerPriceDetail);
        return this.http.put<BillerPriceDetail>(`${this.resourceUrl}/${id}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: BillerPriceDetail = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<BillerPriceDetail[]>): HttpResponse<BillerPriceDetail[]> {
        const jsonResponse: BillerPriceDetail[] = res.body;
        const body: BillerPriceDetail[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Biller.
     */
    private convertItemFromServer(billerPriceDetail: BillerPriceDetail): BillerPriceDetail {
        const copy: BillerPriceDetail = Object.assign({}, billerPriceDetail);
        return copy;
    }

    /**
     * Convert a Biller to a JSON which can be sent to the server.
     */
    private convert(billerPriceDetail: BillerPriceDetail): BillerPriceDetail {
        const copy: BillerPriceDetail = Object.assign({}, billerPriceDetail);
        return copy;
    }
}

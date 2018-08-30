import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { tap } from 'rxjs/operators';

import { PromotionTrans } from './promotion-trans.model';
import { createRequestOption } from '../../shared/model/request-util';
import { SERVER_PATH, REPORT_PATH } from '../../shared/constant/base-constant';

export type EntityResponseType = HttpResponse<PromotionTrans>;

@Injectable()
export class PromotionTransService {

    private resourceUrl =  SERVER_PATH + 'transpromotion';
    private reportUrl = REPORT_PATH;

    constructor(private http: HttpClient) { }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<PromotionTrans>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    query(req?: any): Observable<HttpResponse<PromotionTrans[]>> {
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
            return this.http.get<PromotionTrans[]>(newresourceUrl, { observe: 'response' })
            .pipe(
                tap(promotionTrans => console.log('raw ', promotionTrans ))
            );
        } else {
            return this.http.get<PromotionTrans[]>(`${this.resourceUrl}`, {  observe: 'response' })
            .pipe(
                tap(promotionTrans => console.log('raw ', promotionTrans ))
            );
        }
    }

    create(promotionTrans: PromotionTrans): Observable<EntityResponseType> {
        const copy = this.convert(promotionTrans);
        return this.http.post<PromotionTrans>(`${this.resourceUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    update(id: number, promotionTrans: PromotionTrans): Observable<EntityResponseType> {
        const copy = this.convert(promotionTrans);
        return this.http.put<PromotionTrans>(`${this.resourceUrl}/${id}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    async exportCSV(reportType: string, filter?: any): Promise<HttpResponse<Blob>> {
        const file =  await this.http.post<Blob>(
            `${this.reportUrl}promotiontrans/${reportType}`, filter,
            {responseType: 'blob' as 'json', observe: 'response'}
        ).toPromise();
        return file;
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: PromotionTrans = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<PromotionTrans[]>): HttpResponse<PromotionTrans[]> {
        const jsonResponse: PromotionTrans[] = res.body;
        const body: PromotionTrans[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Promotion Trans.
     */
    private convertItemFromServer(promotionTrans: PromotionTrans): PromotionTrans {
        const copy: PromotionTrans = Object.assign({}, promotionTrans);
        return copy;
    }

    /**
     * Convert a Promotion Trans to a JSON which can be sent to the server.
     */
    private convert(promotionTrans: PromotionTrans): PromotionTrans {
        const copy: PromotionTrans = Object.assign({}, promotionTrans);
        return copy;
    }

    filter(req?: any): Observable<HttpResponse<PromotionTrans[]>> {
        console.log('Filter  ', req);

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

        newresourceUrl = this.resourceUrl + `/filter/page/${pageNumber}/count/${pageCount}`;
        return this.http.post<PromotionTrans[]>(newresourceUrl, req['filter'], {  observe: 'response' })
            .pipe(
                // map((res: HttpResponse<Member[]>) => this.convertArrayResponse(res))
                tap(results => console.log('raw ', results ) )
                    // console.log('observable ', billerCompanies)
                );

    }
}

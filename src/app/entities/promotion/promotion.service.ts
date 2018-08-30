import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { tap } from 'rxjs/operators';

import { Promotion } from './promotion.model';
import { createRequestOption } from '../../shared/model/request-util';
import { SERVER_PATH, REPORT_PATH } from '../../shared/constant/base-constant';

export type EntityResponseType = HttpResponse<Promotion>;

@Injectable()
export class PromotionService {

    private resourceUrl =  SERVER_PATH + 'promotion';
    private reportUrl = REPORT_PATH;

    constructor(private http: HttpClient) { }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Promotion>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    query(req?: any): Observable<HttpResponse<Promotion[]>> {
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
            return this.http.get<Promotion[]>(newresourceUrl, { observe: 'response' })
            .pipe(
                tap(promotion => console.log('raw ', promotion ))
            );
        } else {
            return this.http.get<Promotion[]>(`${this.resourceUrl}`, {  observe: 'response' })
            .pipe(
                tap(promotion => console.log('raw ', promotion ))
            );
        }
    }

    create(promotion: Promotion): Observable<EntityResponseType> {
        const copy = this.convert(promotion);
        return this.http.post<Promotion>(`${this.resourceUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    update(id: number, promotion: Promotion): Observable<EntityResponseType> {
        const copy = this.convert(promotion);
        return this.http.put<Promotion>(`${this.resourceUrl}/${id}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    async exportCSV(reportType: string, filter?: any): Promise<HttpResponse<Blob>> {
        const file =  await this.http.post<Blob>(
            `${this.reportUrl}promotion/${reportType}`, filter,
            {responseType: 'blob' as 'json', observe: 'response'}
        ).toPromise();
        return file;
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Promotion = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Promotion[]>): HttpResponse<Promotion[]> {
        const jsonResponse: Promotion[] = res.body;
        const body: Promotion[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Promotion.
     */
    private convertItemFromServer(promotion: Promotion): Promotion {
        const copy: Promotion = Object.assign({}, promotion);
        return copy;
    }

    /**
     * Convert a Promotion to a JSON which can be sent to the server.
     */
    private convert(promotion: Promotion): Promotion {
        const copy: Promotion = Object.assign({}, promotion);
        return copy;
    }

    filter(req?: any): Observable<HttpResponse<Promotion[]>> {
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
        return this.http.post<Promotion[]>(newresourceUrl, req['filter'], {  observe: 'response' })
            .pipe(
                // map((res: HttpResponse<Member[]>) => this.convertArrayResponse(res))
                tap(results => console.log('raw ', results ) )
                    // console.log('observable ', billerCompanies)
                );

    }

    budgetRequired(val: number): Observable<HttpResponse<Promotion[]>> {
        let newresourceUrl = null;

        newresourceUrl = this.resourceUrl + `/budgetrequired/${val}`;
        return this.http.get<Promotion[]>(newresourceUrl, { observe: 'response' })
        .pipe(
            tap(promotion => console.log('raw ', promotion ))
        );
    }
}

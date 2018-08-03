import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { createRequestOption } from '../../shared/model/request-util';
import { DepositHistory } from '.';
import { SERVER_PATH, REPORT_PATH } from '../../shared/constant/base-constant';

export type EntityResponseType = HttpResponse<DepositHistory>;

@Injectable()
export class DepositHistoryService {

    private resourceUrl = SERVER_PATH + 'deposithistory';
    private reportUrl =  REPORT_PATH;
    constructor(private http: HttpClient) { }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<DepositHistory>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    query(req?: any): Observable<HttpResponse<DepositHistory[]>> {
        console.log('isi reg  ', req);
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
            return this.http.get<DepositHistory[]>(newresourceUrl, {  observe: 'response' })
                .pipe(
                    // map((res: HttpResponse<DepositHistory[]>) => this.convertArrayResponse(res))
                    tap(DepositHistories => console.log('raw ', DepositHistories ) )
                        // console.log('observable ', DepositHistorys)
                    );
        } else {
            return this.http.get<DepositHistory[]>(`${this.resourceUrl}`, {  observe: 'response' })
            .pipe(
                // map((res: HttpResponse<DepositHistory[]>) => this.convertArrayResponse(res))
                tap(DepositHistories => console.log('raw ', DepositHistories ) )
                    // console.log('observable ', DepositHistorys)
                );
        }

    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: DepositHistory = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<DepositHistory[]>): HttpResponse<DepositHistory[]> {
        const jsonResponse: DepositHistory[] = res.body;
        const body: DepositHistory[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to DepositHistory.
     */
    private convertItemFromServer(depositHistory: DepositHistory): DepositHistory {
        const copyOb: DepositHistory = Object.assign({}, depositHistory);
        return copyOb;
    }

    /**
     * Convert a DepositHistory to a JSON which can be sent to the server.
     */
    private convert( depositHistory: DepositHistory): DepositHistory {
        const copy: DepositHistory = Object.assign({}, depositHistory);
        return copy;
    }

    async exportCSV(req?: any): Promise<HttpResponse<Blob>> {
        const file =  await this.http.post<Blob>(
            `${this.reportUrl}deposithistory/csv`, req['filter'],
            {responseType: 'blob' as 'json', observe : 'response'}
        ).toPromise();
        return file;
    }

    filter(req?: any): Observable<HttpResponse<DepositHistory[]>> {
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
        return this.http.post<DepositHistory[]>(newresourceUrl, req['filter'], {  observe: 'response' })
            .pipe(
                // map((res: HttpResponse<Member[]>) => this.convertArrayResponse(res))
                tap(results => console.log('raw ', results ) )
            );

    }


}

import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { createRequestOption } from '../../shared/model/request-util';
import { Deposit } from '.';
import { SERVER_PATH, REPORT_PATH } from '../../shared/constant/base-constant';

export type EntityResponseType = HttpResponse<Deposit>;

@Injectable()
export class DepositService {

    private resourceUrl = SERVER_PATH + 'manualdeposit';
    private reportUrl =  REPORT_PATH;
    constructor(private http: HttpClient) { }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Deposit>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    query(req?: any): Observable<HttpResponse<Deposit[]>> {
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
            return this.http.get<Deposit[]>(newresourceUrl, {  observe: 'response' })
                .pipe(
                    // map((res: HttpResponse<Deposit[]>) => this.convertArrayResponse(res))
                    tap(DepositHistories => console.log('raw ', DepositHistories ) )
                        // console.log('observable ', Deposits)
                    );
        } else {
            return this.http.get<Deposit[]>(`${this.resourceUrl}`, {  observe: 'response' })
            .pipe(
                // map((res: HttpResponse<Deposit[]>) => this.convertArrayResponse(res))
                tap(DepositHistories => console.log('raw ', DepositHistories ) )
                    // console.log('observable ', Deposits)
                );
        }

    }

    create(deposit: Deposit): Observable<EntityResponseType> {
        const copy = this.convert(deposit);
        if (copy.transTypeId === 7) {
            this.resourceUrl = SERVER_PATH + 'manualrefund';
        }
        return this.http.post<Deposit>(`${this.resourceUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Deposit = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Deposit[]>): HttpResponse<Deposit[]> {
        const jsonResponse: Deposit[] = res.body;
        const body: Deposit[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Deposit.
     */
    private convertItemFromServer(depositHistory: Deposit): Deposit {
        const copyOb: Deposit = Object.assign({}, depositHistory);
        return copyOb;
    }

    /**
     * Convert a Deposit to a JSON which can be sent to the server.
     */
    private convert( depositHistory: Deposit): Deposit {
        const copy: Deposit = Object.assign({}, depositHistory);
        return copy;
    }

    async exportCSV(reportType: string, filter?: any): Promise<HttpResponse<Blob>> {
        const file =  await this.http.post<Blob>(
            `${this.reportUrl}billerheader/${reportType}`, filter,
            {responseType: 'blob' as 'json', observe: 'response'}
        ).toPromise();
        return file;
    }

    filter(req?: any): Observable<HttpResponse<Deposit[]>> {
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
        return this.http.post<Deposit[]>(newresourceUrl, req['filter'], {  observe: 'response' })
            .pipe(
                // map((res: HttpResponse<Member[]>) => this.convertArrayResponse(res))
                tap(results => console.log('raw ', results ) )
            );

    }


}

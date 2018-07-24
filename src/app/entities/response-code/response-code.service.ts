import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { createRequestOption } from '../../shared/model/request-util';
import { ResponseCode } from './response-code.model';
import { SERVER_PATH, REPORT_PATH } from '../../shared/constant/base-constant';

export type EntityResponseType = HttpResponse<ResponseCode>;

@Injectable()
export class ResponseCodeService {

    private resourceUrl = SERVER_PATH + 'responsecode';
    private reportUrl = REPORT_PATH;

    constructor(private http: HttpClient) { }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ResponseCode>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    create(responseCode: ResponseCode): Observable<EntityResponseType> {
        const copy = this.convert(responseCode);
        return this.http.post<ResponseCode>(`${this.resourceUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    update(id: number, responseCode: ResponseCode): Observable<EntityResponseType> {
        const copy = this.convert(responseCode);
        return this.http.put<ResponseCode>(`${this.resourceUrl}/${id}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    query(req?: any): Observable<HttpResponse<ResponseCode[]>> {
        const options = createRequestOption(req);
        let allData = null;
        let pageNumber = null;
        let pageCount = null;
        let newresourceUrl = null;
        Object.keys(req).forEach((key) => {
            if (key === 'allData') {
                allData = req[key];
            }
            if (key === 'page') {
                pageNumber = req[key];
            }
            if (key === 'count') {
                pageCount = req[key];
            }

        });
        if (pageNumber !== null ) {
            newresourceUrl = this.resourceUrl + `/isAllData/${allData}/page/${pageNumber}/count/${pageCount}`;
            return this.http.get<ResponseCode[]>(newresourceUrl, {  observe: 'response' })
                .pipe(
                    // map((res: HttpResponse<ResponseCode[]>) => this.convertArrayResponse(res))
                    tap(billerCompanies => console.log('raw ', billerCompanies ) )
                        // console.log('observable ', billerCompanies)
                    );
        } else {
            return this.http.get<ResponseCode[]>(`${this.resourceUrl}`, {  observe: 'response' })
            .pipe(
                // map((res: HttpResponse<ResponseCode[]>) => this.convertArrayResponse(res))
                tap(billerCompanies => console.log('raw ', billerCompanies ) )
                    // console.log('observable ', billerCompanies)
                );
        }

    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: ResponseCode = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<ResponseCode[]>): HttpResponse<ResponseCode[]> {
        const jsonResponse: ResponseCode[] = res.body;
        const body: ResponseCode[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to ResponseCode.
     */
    private convertItemFromServer(responseCode: ResponseCode): ResponseCode {
        const copyOb: ResponseCode = Object.assign({}, responseCode);
        return copyOb;
    }

    /**
     * Convert a ResponseCode to a JSON which can be sent to the server.
     */
    private convert( responseCode: ResponseCode): ResponseCode {
        const copy: ResponseCode = Object.assign({}, responseCode);
        return copy;
    }

    async exportCSV(): Promise<Blob> {
        const file =  await this.http.get<Blob>(
            `${this.reportUrl}responsecode/csv`,
            {responseType: 'blob' as 'json'}
        ).toPromise();
        return file;
    }

    filter(req?: any): Observable<HttpResponse<ResponseCode[]>> {
        console.log('Filter  ', req);

        const options = createRequestOption(req);
        let allData = null;
        let pageNumber = null;
        let pageCount = null;
        let newresourceUrl = null;

        Object.keys(req).forEach((key) => {
            if (key === 'allData') {
                allData = req[key];
            }
            if (key === 'page') {
                pageNumber = req[key];
            }
            if (key === 'count') {
                pageCount = req[key];
            }
        });

        newresourceUrl = this.resourceUrl + `/filter/isAllData/${allData}/page/${pageNumber}/count/${pageCount}`;
        return this.http.post<ResponseCode[]>(newresourceUrl, req['filter'], {  observe: 'response' })
            .pipe(
                // map((res: HttpResponse<Member[]>) => this.convertArrayResponse(res))
                tap(results => console.log('raw ', results ) )
                    // console.log('observable ', billerCompanies)
                );

    }

}

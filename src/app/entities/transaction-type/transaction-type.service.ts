import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { createRequestOption } from '../../shared/model/request-util';
import { TransType } from '.';
import { SERVER_PATH, REPORT_PATH } from '../../shared/constant/base-constant';

export type EntityResponseType = HttpResponse<TransType>;

@Injectable()
export class TransTypeService {

    private resourceUrl = SERVER_PATH + 'transtype';
    private reportUrl =  REPORT_PATH;
    constructor(private http: HttpClient) { }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<TransType>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    create(transType: TransType): Observable<EntityResponseType> {
        const copy = this.convert(transType);
        // console.log('mapp to ' , this.resourceUrl, transType);
        return this.http.post<TransType>(`${this.resourceUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    update(id: number, transType: TransType): Observable<EntityResponseType> {
        const copy = this.convert(transType);
        console.log('mapp to ' , `${this.resourceUrl}/${id}`, transType);
        return this.http.put<TransType>(`${this.resourceUrl}/${id}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    query(req?: any): Observable<HttpResponse<TransType[]>> {
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
            return this.http.get<TransType[]>(newresourceUrl, {  observe: 'response' })
                .pipe(
                    // map((res: HttpResponse<TransType[]>) => this.convertArrayResponse(res))
                    tap(transTypes => console.log('raw ', transTypes ) )
                        // console.log('observable ', transTypes)
                    );
        } else {
            return this.http.get<TransType[]>(`${this.resourceUrl}`, {  observe: 'response' })
            .pipe(
                // map((res: HttpResponse<TransType[]>) => this.convertArrayResponse(res))
                tap(transTypes => console.log('raw ', transTypes ) )
                    // console.log('observable ', transTypes)
                );
        }

    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: TransType = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<TransType[]>): HttpResponse<TransType[]> {
        const jsonResponse: TransType[] = res.body;
        const body: TransType[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to TransType.
     */
    private convertItemFromServer(transType: TransType): TransType {
        const copyOb: TransType = Object.assign({}, transType);
        return copyOb;
    }

    /**
     * Convert a TransType to a JSON which can be sent to the server.
     */
    private convert( transType: TransType): TransType {
        const copy: TransType = Object.assign({}, transType);
        return copy;
    }

    async exportCSV(): Promise<Blob> {
        const file =  await this.http.get<Blob>(
            `${this.reportUrl}transtype/csv`,
            {responseType: 'blob' as 'json'}
        ).toPromise();
        return file;
    }

    filter(req?: any): Observable<HttpResponse<TransType[]>> {
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
        return this.http.post<TransType[]>(newresourceUrl, req['filter'], {  observe: 'response' })
            .pipe(
                // map((res: HttpResponse<Member[]>) => this.convertArrayResponse(res))
                tap(results => console.log('raw ', results ) )
            );

    }


}

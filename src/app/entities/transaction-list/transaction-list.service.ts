import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { createRequestOption } from '../../shared/model/request-util';
import { TransList } from '.';
import { SERVER_PATH, REPORT_PATH } from '../../shared/constant/base-constant';

export type EntityResponseType = HttpResponse<TransList>;

@Injectable()
export class TransListService {

    private resourceUrl = SERVER_PATH + 'trans';
    private reportUrl =  REPORT_PATH;
    constructor(private http: HttpClient) { }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<TransList>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    query(req?: any): Observable<HttpResponse<TransList[]>> {
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
            return this.http.get<TransList[]>(newresourceUrl, {  observe: 'response' })
                .pipe(
                    // map((res: HttpResponse<TransList[]>) => this.convertArrayResponse(res))
                    tap(transLists => console.log('raw ', transLists ) )
                        // console.log('observable ', transLists)
                    );
        } else {
            return this.http.get<TransList[]>(`${this.resourceUrl}`, {  observe: 'response' })
            .pipe(
                // map((res: HttpResponse<TransList[]>) => this.convertArrayResponse(res))
                tap(transLists => console.log('raw ', transLists ) )
                    // console.log('observable ', transLists)
                );
        }

    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: TransList = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<TransList[]>): HttpResponse<TransList[]> {
        const jsonResponse: TransList[] = res.body;
        const body: TransList[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to TransList.
     */
    private convertItemFromServer(transList: TransList): TransList {
        const copyOb: TransList = Object.assign({}, transList);
        return copyOb;
    }

    /**
     * Convert a TransList to a JSON which can be sent to the server.
     */
    private convert( transList: TransList): TransList {
        const copy: TransList = Object.assign({}, transList);
        return copy;
    }

    getTotalRec(req?: any): Observable<HttpResponse<TransList[]>> {
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

        newresourceUrl = `${this.reportUrl}trans/totalRec`;
        return this.http.post<any>(newresourceUrl, req['filter'], {  observe: 'response' })
            .pipe(
                // map((res: HttpResponse<Member[]>) => this.convertArrayResponse(res))
                tap(results => console.log('raw ', results ) )
            );
    }

    async exportCSV(req?: any): Promise<HttpResponse<Blob>> {
        const file =  await this.http.post<Blob>(
            `${this.reportUrl}trans/csv`, req['filter'],
            {responseType: 'blob' as 'json', observe: 'response'}
        ).toPromise();
        return file;
    }

    filter(req?: any, detail?: any): Observable<HttpResponse<TransList[]>> {
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

        if  (detail === true ) {
            newresourceUrl = this.resourceUrl + `/filterDetail/page/${pageNumber}/count/${pageCount}`;
        } else {
            newresourceUrl = this.resourceUrl + `/filter/page/${pageNumber}/count/${pageCount}`;
        }
        return this.http.post<TransList[]>(newresourceUrl, req['filter'], {  observe: 'response' })
            .pipe(
                // map((res: HttpResponse<Member[]>) => this.convertArrayResponse(res))
                tap(results => console.log('raw ', results ) )
            );

    }

    // filterDetail

    update(id: number, transList: object): Observable<EntityResponseType> {
        const copy = this.convert(transList);
        // return this.http.put<TransList>(`${this.resourceUrl}/${id}`, copy, { observe: 'response'})
        return this.http.put<TransList>(`${this.resourceUrl}/updateRcInternal`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

}

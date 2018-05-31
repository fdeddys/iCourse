import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { createRequestOption } from '../../shared/model/request-util';
import { BillerType } from './biller-type.model';

export type EntityResponseType = HttpResponse<BillerType>;

@Injectable()
export class BillerTypeService {

    private resourceUrl =  'http://localhost:8080/api/billertype';

    constructor(private http: HttpClient) { }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<BillerType>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    create(billerType: BillerType): Observable<EntityResponseType> {
        const copy = this.convert(billerType);
        return this.http.post<BillerType>(`${this.resourceUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    update(id: number, billerType: BillerType): Observable<EntityResponseType> {
        const copy = this.convert(billerType);
        return this.http.put<BillerType>(`${this.resourceUrl}/${id}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    query(req?: any): Observable<HttpResponse<BillerType[]>> {
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
            return this.http.get<BillerType[]>(newresourceUrl, {  observe: 'response' })
                .pipe(
                    // map((res: HttpResponse<BillerType[]>) => this.convertArrayResponse(res))
                    tap(billerCompanies => console.log('raw ', billerCompanies ) )
                        // console.log('observable ', billerCompanies)
                    );
        } else {
            return this.http.get<BillerType[]>(`${this.resourceUrl}`, {  observe: 'response' })
            .pipe(
                // map((res: HttpResponse<BillerType[]>) => this.convertArrayResponse(res))
                tap(billerCompanies => console.log('raw ', billerCompanies ) )
                    // console.log('observable ', billerCompanies)
                );
        }

    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: BillerType = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<BillerType[]>): HttpResponse<BillerType[]> {
        const jsonResponse: BillerType[] = res.body;
        const body: BillerType[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to BillerType.
     */
    private convertItemFromServer(billerType: BillerType): BillerType {
        const copyOb: BillerType = Object.assign({}, billerType);
        return copyOb;
    }

    /**
     * Convert a BillerType to a JSON which can be sent to the server.
     */
    private convert( billerType: BillerType): BillerType {
        const copy: BillerType = Object.assign({}, billerType);
        return copy;
    }
}

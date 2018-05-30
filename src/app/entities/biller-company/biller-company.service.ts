import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { createRequestOption } from '../../shared/model/request-util';
import { BillerCompany } from '.';

export type EntityResponseType = HttpResponse<BillerCompany>;

@Injectable()
export class BillerCompanyService {

    private resourceUrl =  'http://localhost:8080/api/billercompany';

    constructor(private http: HttpClient) { }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<BillerCompany>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    query(req?: any): Observable<HttpResponse<BillerCompany[]>> {
        console.log('isi reg  ', req);
        const options = createRequestOption(req);
        let pageNumber = null;
        let pageCount = null;
        Object.keys(req).forEach((key) => {
            if (key === 'page') {
                pageNumber = req[key];
            }
            if (key === 'count') {
                pageCount = req[key];
            }

        });
        if (pageNumber !== null ) {
            this.resourceUrl = this.resourceUrl + `/page/${pageNumber}/count/${pageCount}`;
        }
        return this.http.get<BillerCompany[]>(this.resourceUrl, {  observe: 'response' })
            .pipe(
                // map((res: HttpResponse<BillerCompany[]>) => this.convertArrayResponse(res))
                tap(billerCompanies => console.log('raw ', billerCompanies ) )
                    // console.log('observable ', billerCompanies)
                );
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: BillerCompany = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<BillerCompany[]>): HttpResponse<BillerCompany[]> {
        const jsonResponse: BillerCompany[] = res.body;
        const body: BillerCompany[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to BillerCompany.
     */
    private convertItemFromServer(billerCompany: BillerCompany): BillerCompany {
        const copyOb: BillerCompany = Object.assign({}, BillerCompany);
        return copyOb;
    }

    /**
     * Convert a BillerCompany to a JSON which can be sent to the server.
     */
    private convert( billerCompany: BillerCompany): BillerCompany {
        const copy: BillerCompany = Object.assign({}, BillerCompany);
        return copy;
    }
}

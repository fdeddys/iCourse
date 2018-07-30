import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { tap } from 'rxjs/operators';

import { Product } from './product.model';
import { createRequestOption } from '../../shared/model/request-util';
import { SERVER_PATH, REPORT_PATH } from '../../shared/constant/base-constant';

export type EntityResponseType = HttpResponse<Product>;

@Injectable()
export class ProductService {

    private resourceUrl =  SERVER_PATH + 'billerproduct';
    private searchByUtilUrl = SERVER_PATH + 'util/searchbylist';
    private statusUtilUrl = SERVER_PATH + 'util/statuses';

    private reportUrl = REPORT_PATH;

    constructor(private http: HttpClient) { }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Product>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    query(req?: any): Observable<HttpResponse<Product[]>> {
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
            return this.http.get<Product[]>(newresourceUrl, { observe: 'response' })
            .pipe(
                tap(billerCompanies => console.log('raw ', billerCompanies ))
            );
        } else {
            return this.http.get<Product[]>(`${this.resourceUrl}`, {  observe: 'response' })
            .pipe(
                tap(billerCompanies => console.log('raw ', billerCompanies ))
            );
        }
    }

    create(product: Product): Observable<EntityResponseType> {
        const copy = this.convert(product);
        return this.http.post<Product>(`${this.resourceUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    update(id: number, product: Product): Observable<EntityResponseType> {
        const copy = this.convert(product);
        return this.http.put<Product>(`${this.resourceUrl}/${id}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    async exportCSV(reportType: string, filter?: any): Promise<HttpResponse<Blob>> {
        const file =  await this.http.post<Blob>(
            `${this.reportUrl}billerproduct/${reportType}`, filter,
            {responseType: 'blob' as 'json', observe: 'response'}
        ).toPromise();
        return file;
    }

    getSearchBy(req?: any): Observable<HttpResponse<string[]>> {
        return this.http.get<string[]>(`${this.searchByUtilUrl}`, { observe: 'response'})
        .pipe(
            tap(searchby => { })
        );
    }

    getStatus(req?: any): Observable<HttpResponse<string[]>> {
        return this.http.get<string[]>(`${this.statusUtilUrl}`, { observe: 'response'})
        .pipe(
            tap(status => { })
        );
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Product = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Product[]>): HttpResponse<Product[]> {
        const jsonResponse: Product[] = res.body;
        const body: Product[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Product.
     */
    private convertItemFromServer(product: Product): Product {
        const copy: Product = Object.assign({}, product);
        return copy;
    }

    /**
     * Convert a Product to a JSON which can be sent to the server.
     */
    private convert(product: Product): Product {
        const copy: Product = Object.assign({}, product);
        return copy;
    }

    filter(req?: any): Observable<HttpResponse<Product[]>> {
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
        return this.http.post<Product[]>(newresourceUrl, req['filter'], {  observe: 'response' })
            .pipe(
                // map((res: HttpResponse<Member[]>) => this.convertArrayResponse(res))
                tap(results => console.log('raw ', results ) )
                    // console.log('observable ', billerCompanies)
                );

    }
}

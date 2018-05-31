import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { tap } from 'rxjs/operators';

import { Product } from './product.model';
import { createRequestOption } from '../../shared/model/request-util';

export type EntityResponseType = HttpResponse<Product>;

@Injectable()
export class ProductService {

    private resourceUrl =  'http://localhost:8080/api/billerproduct';

    constructor(private http: HttpClient) { }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Product>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    query(req?: any): Observable<HttpResponse<Product[]>> {
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
        return this.http.get<Product[]>(this.resourceUrl, { params: options, observe: 'response' })
            // .pipe(map((res: HttpResponse<Product[]>) => this.convertArrayResponse(res)));
            .pipe(
                tap(res => this.convertArrayResponse(res))
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
}

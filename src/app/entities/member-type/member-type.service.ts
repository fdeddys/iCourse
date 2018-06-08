import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { createRequestOption } from '../../shared/model/request-util';
import { MemberType } from './member-type.model';
import { SERVER_PATH } from '../../shared/constant/base-constant';

export type EntityResponseType = HttpResponse<MemberType>;

@Injectable()
export class MemberTypeService {

    private resourceUrl =  SERVER_PATH + 'membertype';

    constructor(private http: HttpClient) { }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<MemberType>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    create(memberType: MemberType): Observable<EntityResponseType> {
        const copy = this.convert(memberType);
        return this.http.post<MemberType>(`${this.resourceUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    update(id: number, memberType: MemberType): Observable<EntityResponseType> {
        const copy = this.convert(memberType);
        return this.http.put<MemberType>(`${this.resourceUrl}/${id}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    query(req?: any): Observable<HttpResponse<MemberType[]>> {
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
            return this.http.get<MemberType[]>(newresourceUrl, {  observe: 'response' })
                .pipe(
                    // map((res: HttpResponse<memberType[]>) => this.convertArrayResponse(res))
                    tap(memberCompanies => console.log('raw ', memberCompanies ) )
                        // console.log('observable ', memberCompanies)
                    );
        } else {
            return this.http.get<MemberType[]>(`${this.resourceUrl}`, {  observe: 'response' })
            .pipe(
                // map((res: HttpResponse<memberType[]>) => this.convertArrayResponse(res))
                tap(memberCompanies => console.log('raw ', memberCompanies ) )
                    // console.log('observable ', memberCompanies)
                );
        }

    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: MemberType = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<MemberType[]>): HttpResponse<MemberType[]> {
        const jsonResponse: MemberType[] = res.body;
        const body: MemberType[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to memberType.
     */
    private convertItemFromServer(memberType: MemberType): MemberType {
        const copyOb: MemberType = Object.assign({}, memberType);
        return copyOb;
    }

    /**
     * Convert a memberType to a JSON which can be sent to the server.
     */
    private convert( memberType: MemberType): MemberType {
        const copy: MemberType = Object.assign({}, memberType);
        return copy;
    }
}

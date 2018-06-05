import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { createRequestOption } from '../../shared/model/request-util';
import { MemberBank } from './member-bank.model';

export type EntityResponseType = HttpResponse<MemberBank>;

@Injectable()
export class MemberBankService {

    private resourceUrl =  'http://localhost:8080/api/memberbank';

    constructor(private http: HttpClient) { }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<MemberBank>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    create(memberBank: MemberBank): Observable<EntityResponseType> {
        const copy = this.convert(memberBank);
        return this.http.post<MemberBank>(`${this.resourceUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    update(id: number, memberBank: MemberBank): Observable<EntityResponseType> {
        const copy = this.convert(memberBank);
        return this.http.put<MemberBank>(`${this.resourceUrl}/${id}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    query(req?: any): Observable<HttpResponse<MemberBank[]>> {
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
            return this.http.get<MemberBank[]>(newresourceUrl, {  observe: 'response' })
                .pipe(
                    // map((res: HttpResponse<memberBank[]>) => this.convertArrayResponse(res))
                    tap(memberCompanies => console.log('raw ', memberCompanies ) )
                        // console.log('observable ', memberCompanies)
                    );
        } else {
            return this.http.get<MemberBank[]>(`${this.resourceUrl}`, {  observe: 'response' })
            .pipe(
                // map((res: HttpResponse<memberBank[]>) => this.convertArrayResponse(res))
                tap(memberCompanies => console.log('raw ', memberCompanies ) )
                    // console.log('observable ', memberCompanies)
                );
        }

    }

    getByMember(id: number): Observable<HttpResponse<MemberBank[]>> {

        return this.http.get<MemberBank[]>(this.resourceUrl + `/memberId/${id}`, {  observe: 'response' })
            .pipe(
                tap(memberBank => { } ),
            );
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: MemberBank = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<MemberBank[]>): HttpResponse<MemberBank[]> {
        const jsonResponse: MemberBank[] = res.body;
        const body: MemberBank[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to memberBank.
     */
    private convertItemFromServer(memberBank: MemberBank): MemberBank {
        const copyOb: MemberBank = Object.assign({}, memberBank);
        return copyOb;
    }

    /**
     * Convert a memberBank to a JSON which can be sent to the server.
     */
    private convert( memberBank: MemberBank): MemberBank {
        const copy: MemberBank = Object.assign({}, memberBank);
        return copy;
    }
}

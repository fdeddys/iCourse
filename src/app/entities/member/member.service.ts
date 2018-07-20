import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { createRequestOption } from '../../shared/model/request-util';
import { Member } from './member.model';
import { SERVER_PATH, REPORT_PATH } from '../../shared/constant/base-constant';

export type EntityResponseType = HttpResponse<Member>;

@Injectable()
export class MemberService {

    private resourceUrl = SERVER_PATH + 'member';
    private reportUrl = REPORT_PATH;


    constructor(private http: HttpClient) { }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Member>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    create(member: Member): Observable<EntityResponseType> {
        const copy = this.convert(member);
        // console.log('mapp to ' , this.resourceUrl, member);
        return this.http.post<Member>(`${this.resourceUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    update(id: number, member: Member): Observable<EntityResponseType> {
        const copy = this.convert(member);
        console.log('mapp to ' , `${this.resourceUrl}/${id}`, member);
        return this.http.put<Member>(`${this.resourceUrl}/${id}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    query(req?: any): Observable<HttpResponse<Member[]>> {
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
            return this.http.get<Member[]>(newresourceUrl, {  observe: 'response' })
                .pipe(
                    // map((res: HttpResponse<Member[]>) => this.convertArrayResponse(res))
                    tap(billerCompanies => console.log('raw ', billerCompanies ) )
                        // console.log('observable ', billerCompanies)
                    );
        } else {
            return this.http.get<Member[]>(`${this.resourceUrl}`, {  observe: 'response' })
            .pipe(
                // map((res: HttpResponse<Member[]>) => this.convertArrayResponse(res))
                tap(billerCompanies => console.log('raw ', billerCompanies ) )
                    // console.log('observable ', billerCompanies)
                );
        }

    }

    filter(req?: any): Observable<HttpResponse<Member[]>> {
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
        return this.http.post<Member[]>(newresourceUrl, req['filter'], {  observe: 'response' })
            .pipe(
                // map((res: HttpResponse<Member[]>) => this.convertArrayResponse(res))
                tap(results => console.log('raw ', results ) )
                    // console.log('observable ', billerCompanies)
                );

    }

    findNotAsBiller(req?: any): Observable<HttpResponse<Member[]>> {
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
        return this.http.get<Member[]>(`${this.resourceUrl}/notRegAsBiller/page/${pageNumber}/count/${pageCount}`, {  observe: 'response' })
        .pipe(
            tap(billerCompanies => console.log('raw ', billerCompanies ) )
            );
    }

    findMemberBiller(req?: any): Observable<HttpResponse<Member[]>> {
        return this.http.get<Member[]>(`${this.resourceUrl}/getMemberBiller`, {  observe: 'response' })
        .pipe(
            tap(billerCompanies => console.log('raw ', billerCompanies ) )
            );
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Member = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Member[]>): HttpResponse<Member[]> {
        const jsonResponse: Member[] = res.body;
        const body: Member[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Member.
     */
    private convertItemFromServer(member: Member): Member {
        const copyOb: Member = Object.assign({}, member);
        return copyOb;
    }

    /**
     * Convert a Member to a JSON which can be sent to the server.
     */
    private convert( member: Member): Member {
        const copy: Member = Object.assign({}, member);
        return copy;
    }

    async exportCSV(): Promise<Blob> {
        const file =  await this.http.get<Blob>(
            `${this.reportUrl}member/csv`,
            {responseType: 'blob' as 'json'}
        ).toPromise();
        return file;
    }

    async exportDetaiCSV(id): Promise<Blob> {
        const file =  await this.http.get<Blob>(
            `${this.reportUrl}memberdetail/csv/${id}`,
            {responseType: 'blob' as 'json'}
        ).toPromise();
        return file;
    }
}

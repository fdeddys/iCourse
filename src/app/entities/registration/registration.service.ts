import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { createRequestOption } from '../../shared/model/request-util';
import { Registration } from './registration.model';
import { SERVER_PATH, REPORT_PATH } from '../../shared/constant/base-constant';

export type EntityResponseType = HttpResponse<Registration>;

@Injectable()
export class RegistrationService {

    private resourceUrl = SERVER_PATH + 'registration';
    private reportUrl = REPORT_PATH;

    constructor(private http: HttpClient) { }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Registration>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    create(registration: Registration): Observable<EntityResponseType> {
        const copy = this.convert(registration);
        return this.http.post<Registration>(`${this.resourceUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    update(id: number, registration: Registration): Observable<EntityResponseType> {
        const copy = this.convert(registration);
        return this.http.put<Registration>(`${this.resourceUrl}/${id}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    query(req?: any): Observable<HttpResponse<Registration[]>> {
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
            return this.http.get<Registration[]>(newresourceUrl, {  observe: 'response' })
                .pipe(
                    // map((res: HttpResponse<Registration[]>) => this.convertArrayResponse(res))
                    tap(billerCompanies => console.log('raw ', billerCompanies ) )
                        // console.log('observable ', billerCompanies)
                    );
        } else {
            return this.http.get<Registration[]>(`${this.resourceUrl}`, {  observe: 'response' })
            .pipe(
                // map((res: HttpResponse<Registration[]>) => this.convertArrayResponse(res))
                tap(billerCompanies => console.log('raw ', billerCompanies ) )
                    // console.log('observable ', billerCompanies)
                );
        }

    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Registration = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Registration[]>): HttpResponse<Registration[]> {
        const jsonResponse: Registration[] = res.body;
        const body: Registration[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Registration.
     */
    private convertItemFromServer(registration: Registration): Registration {
        const copyOb: Registration = Object.assign({}, registration);
        return copyOb;
    }

    /**
     * Convert a Registration to a JSON which can be sent to the server.
     */
    private convert( registration: Registration): Registration {
        const copy: Registration = Object.assign({}, registration);
        return copy;
    }

    async exportCSV(req?: any): Promise<HttpResponse<Blob>> {
        const file =  await this.http.post<Blob>(
            `${this.reportUrl}Registration/csv`, req['filter'],
            {responseType: 'blob' as 'json', observe : 'response'}
        ).toPromise();
        return file;
    }

    filter(req?: any): Observable<HttpResponse<Registration[]>> {
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
        console.log('hasil --> ' +  req['filter']);
        newresourceUrl = this.resourceUrl + `/filter/page/${pageNumber}/count/${pageCount}`;
        return this.http.post<Registration[]>(newresourceUrl, req['filter'], {  observe: 'response' })
            .pipe(
                // map((res: HttpResponse<Member[]>) => this.convertArrayResponse(res))
                tap(results => console.log('raw ', results ) )
                    // console.log('observable ', billerCompanies)
                );

    }

}

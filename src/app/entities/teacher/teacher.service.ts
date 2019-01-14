import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { createRequestOption } from '../../shared/model/request-util';
import { Teacher } from './teacher.model';
import { SERVER_PATH, REPORT_PATH } from '../../shared/constant/base-constant';

export type EntityResponseType = HttpResponse<Teacher>;

@Injectable()
export class TeacherService {

    private resourceUrl = SERVER_PATH + 'teacher';
    private reportUrl = REPORT_PATH;

    constructor(private http: HttpClient) { }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Teacher>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    create(teacher: Teacher): Observable<EntityResponseType> {
        const copy = this.convert(teacher);
        return this.http.post<Teacher>(`${this.resourceUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    update(id: number, teacher: Teacher): Observable<EntityResponseType> {
        const copy = this.convert(teacher);
        return this.http.put<Teacher>(`${this.resourceUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    query(req?: any): Observable<HttpResponse<Teacher[]>> {
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
            return this.http.get<Teacher[]>(newresourceUrl, {  observe: 'response' })
                .pipe(
                    // map((res: HttpResponse<Teacher[]>) => this.convertArrayResponse(res))
                    tap(billerCompanies => console.log('raw ', billerCompanies ) )
                        // console.log('observable ', billerCompanies)
                    );
        } else {
            return this.http.get<Teacher[]>(`${this.resourceUrl}`, {  observe: 'response' })
            .pipe(
                // map((res: HttpResponse<Teacher[]>) => this.convertArrayResponse(res))
                tap(billerCompanies => console.log('raw ', billerCompanies ) )
                    // console.log('observable ', billerCompanies)
                );
        }

    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Teacher = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Teacher[]>): HttpResponse<Teacher[]> {
        const jsonResponse: Teacher[] = res.body;
        const body: Teacher[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Teacher.
     */
    private convertItemFromServer(teacher: Teacher): Teacher {
        const copyOb: Teacher = Object.assign({}, teacher);
        return copyOb;
    }

    /**
     * Convert a Teacher to a JSON which can be sent to the server.
     */
    private convert( teacher: Teacher): Teacher {
        const copy: Teacher = Object.assign({}, teacher);
        return copy;
    }

    async exportCSV(req?: any): Promise<HttpResponse<Blob>> {
        const file =  await this.http.post<Blob>(
            `${this.reportUrl}Teacher/csv`, req['filter'],
            {responseType: 'blob' as 'json', observe : 'response'}
        ).toPromise();
        return file;
    }

    filter(req?: any): Observable<HttpResponse<Teacher[]>> {
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
        return this.http.post<Teacher[]>(newresourceUrl, req['filter'], {  observe: 'response' })
            .pipe(
                // map((res: HttpResponse<Member[]>) => this.convertArrayResponse(res))
                tap(results => console.log('raw ', results ) )
                    // console.log('observable ', billerCompanies)
                );

    }

}

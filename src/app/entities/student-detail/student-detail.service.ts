import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { createRequestOption } from '../../shared/model/request-util';
import { StudentDetail } from './student-detail.model';
import { SERVER_PATH, REPORT_PATH } from '../../shared/constant/base-constant';

export type EntityResponseType = HttpResponse<StudentDetail>;

@Injectable()
export class StudentDetailService {

    private resourceUrl = SERVER_PATH + 'student';
    private reportUrl = REPORT_PATH;

    constructor(private http: HttpClient) { }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<StudentDetail>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    findByStudentId(id: number): Observable<EntityResponseType> {
        let newresourceUrl = null;
        newresourceUrl = this.resourceUrl + `/detail`;
        return this.http.get<StudentDetail>(newresourceUrl, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    create(studentDetail: StudentDetail): Observable<EntityResponseType> {
        const copy = this.convert(studentDetail);
        return this.http.post<StudentDetail>(`${this.resourceUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    update(id: number, studentDetail: StudentDetail): Observable<EntityResponseType> {
        const copy = this.convert(studentDetail);
        return this.http.put<StudentDetail>(`${this.resourceUrl}/${id}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    query(req?: any): Observable<HttpResponse<StudentDetail[]>> {
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
            return this.http.get<StudentDetail[]>(newresourceUrl, {  observe: 'response' })
                .pipe(
                    // map((res: HttpResponse<StudentDetail[]>) => this.convertArrayResponse(res))
                    tap(billerCompanies => console.log('raw ', billerCompanies ) )
                        // console.log('observable ', billerCompanies)
                    );
        } else {
            return this.http.get<StudentDetail[]>(`${this.resourceUrl}`, {  observe: 'response' })
            .pipe(
                // map((res: HttpResponse<StudentDetail[]>) => this.convertArrayResponse(res))
                tap(billerCompanies => console.log('raw ', billerCompanies ) )
                    // console.log('observable ', billerCompanies)
                );
        }

    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: StudentDetail = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<StudentDetail[]>): HttpResponse<StudentDetail[]> {
        const jsonResponse: StudentDetail[] = res.body;
        const body: StudentDetail[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to StudentDetail.
     */
    private convertItemFromServer(studentDetail: StudentDetail): StudentDetail {
        const copyOb: StudentDetail = Object.assign({}, studentDetail);
        return copyOb;
    }

    /**
     * Convert a StudentDetail to a JSON which can be sent to the server.
     */
    private convert( studentDetail: StudentDetail): StudentDetail {
        const copy: StudentDetail = Object.assign({}, studentDetail);
        return copy;
    }

    async exportCSV(req?: any): Promise<HttpResponse<Blob>> {
        const file =  await this.http.post<Blob>(
            `${this.reportUrl}StudentDetail/csv`, req['filter'],
            {responseType: 'blob' as 'json', observe : 'response'}
        ).toPromise();
        return file;
    }

    filter(req?: any): Observable<HttpResponse<StudentDetail[]>> {
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
        return this.http.post<StudentDetail[]>(newresourceUrl, req['filter'], {  observe: 'response' })
            .pipe(
                // map((res: HttpResponse<Member[]>) => this.convertArrayResponse(res))
                tap(results => console.log('raw ', results ) )
                    // console.log('observable ', billerCompanies)
                );

    }

}

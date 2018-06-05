import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { createRequestOption } from '../../shared/model/request-util';
import { GlobalSetting } from './global-setting.model';

export type EntityResponseType = HttpResponse<GlobalSetting>;

@Injectable()
export class GlobalSettingService {

    private resourceUrl =  'http://localhost:8080/api/globalsetting';

    constructor(private http: HttpClient) { }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<GlobalSetting>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    findByGlobalType(id: String): Observable<HttpResponse<GlobalSetting[]>> {
        return this.http.get<GlobalSetting[]>(`${this.resourceUrl}/globaltype/${id}`, { observe: 'response'})
            .pipe(
                tap(globalSettings => { })
            );
    }

    create(globalSetting: GlobalSetting): Observable<EntityResponseType> {
        const copy = this.convert(globalSetting);
        return this.http.post<GlobalSetting>(`${this.resourceUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    update(id: number, globalSetting: GlobalSetting): Observable<EntityResponseType> {
        const copy = this.convert(globalSetting);
        return this.http.put<GlobalSetting>(`${this.resourceUrl}/${id}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    query(req?: any): Observable<HttpResponse<GlobalSetting[]>> {
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
            return this.http.get<GlobalSetting[]>(newresourceUrl, {  observe: 'response' })
                .pipe(
                    // map((res: HttpResponse<globalSetting[]>) => this.convertArrayResponse(res))
                    tap(memberCompanies => console.log('raw ', memberCompanies ) )
                        // console.log('observable ', memberCompanies)
                    );
        } else {
            return this.http.get<GlobalSetting[]>(`${this.resourceUrl}`, {  observe: 'response' })
            .pipe(
                // map((res: HttpResponse<globalSetting[]>) => this.convertArrayResponse(res))
                tap(memberCompanies => console.log('raw ', memberCompanies ) )
                    // console.log('observable ', memberCompanies)
                );
        }

    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: GlobalSetting = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<GlobalSetting[]>): HttpResponse<GlobalSetting[]> {
        const jsonResponse: GlobalSetting[] = res.body;
        const body: GlobalSetting[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to globalSetting.
     */
    private convertItemFromServer(globalSetting: GlobalSetting): GlobalSetting {
        const copyOb: GlobalSetting = Object.assign({}, globalSetting);
        return copyOb;
    }

    /**
     * Convert a globalSetting to a JSON which can be sent to the server.
     */
    private convert( globalSetting: GlobalSetting): GlobalSetting {
        const copy: GlobalSetting = Object.assign({}, globalSetting);
        return copy;
    }
}

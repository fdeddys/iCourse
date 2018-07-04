import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { tap } from 'rxjs/operators';

import { AuditTrail } from './audit-trail.model';
import { createRequestOption } from '../../shared/model/request-util';
import { SERVER_PATH } from '../../shared/constant/base-constant';

export type EntityResponseType = HttpResponse<AuditTrail>;

@Injectable()
export class AuditTrailService {

private resourceUrl = SERVER_PATH + 'audit';

    constructor(private http: HttpClient) { }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<AuditTrail>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    query(req?: any): Observable<HttpResponse<AuditTrail[]>> {
        const options = createRequestOption(req);
        let tgl1 = null;
        let tgl2 = null;
        let pageNumber = null;
        let pageCount = null;
        Object.keys(req).forEach((key) => {
            if (key === 'tgl1') {
                tgl1 = req[key];
            }
            if (key === 'tgl2') {
                tgl2 = req[key];
            }
            if (key === 'page') {
                pageNumber = req[key];
            }
            if (key === 'count') {
                pageCount = req[key];
            }
        });

        return this.http.get<AuditTrail[]>(`${this.resourceUrl}/${tgl1}/${tgl2}/page/${pageNumber}/count/${pageCount}`,
        {  observe: 'response' })
        .pipe(
            tap(auditTrail => console.log('raw ', auditTrail ))
        );

    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: AuditTrail = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<AuditTrail[]>): HttpResponse<AuditTrail[]> {
        const jsonResponse: AuditTrail[] = res.body;
        const body: AuditTrail[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to AuditTrail.
     */
    private convertItemFromServer(auditTrail: AuditTrail): AuditTrail {
        const copy: AuditTrail = Object.assign({}, auditTrail);
        return copy;
    }

    /**
     * Convert a AuditTrail to a JSON which can be sent to the server.
     */
    private convert(auditTrail: AuditTrail): AuditTrail {
        const copy: AuditTrail = Object.assign({}, auditTrail);
        return copy;
    }
}

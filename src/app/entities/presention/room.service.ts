import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { createRequestOption } from '../../shared/model/request-util';
import { Room } from './room.model';
import { SERVER_PATH, REPORT_PATH } from '../../shared/constant/base-constant';

export type EntityResponseType = HttpResponse<Room>;

@Injectable()
export class RoomService {

    private resourceUrl = SERVER_PATH + 'room';
    private reportUrl = REPORT_PATH;

    constructor(private http: HttpClient) { }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<Room>(`${this.resourceUrl}/${id}`, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    create(room: Room): Observable<EntityResponseType> {
        const copy = this.convert(room);
        return this.http.post<Room>(`${this.resourceUrl}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    update(id: number, room: Room): Observable<EntityResponseType> {
        const copy = this.convert(room);
        return this.http.put<Room>(`${this.resourceUrl}/${id}`, copy, { observe: 'response'})
            .pipe(map((res: EntityResponseType) => this.convertResponse(res)));
    }

    query(req?: any): Observable<HttpResponse<Room[]>> {
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
            return this.http.get<Room[]>(newresourceUrl, {  observe: 'response' })
                .pipe(
                    // map((res: HttpResponse<Room[]>) => this.convertArrayResponse(res))
                    tap(billerCompanies => console.log('raw ', billerCompanies ) )
                        // console.log('observable ', billerCompanies)
                    );
        } else {
            return this.http.get<Room[]>(`${this.resourceUrl}`, {  observe: 'response' })
            .pipe(
                // map((res: HttpResponse<Room[]>) => this.convertArrayResponse(res))
                tap(billerCompanies => console.log('raw ', billerCompanies ) )
                    // console.log('observable ', billerCompanies)
                );
        }

    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Room = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Room[]>): HttpResponse<Room[]> {
        const jsonResponse: Room[] = res.body;
        const body: Room[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to Room.
     */
    private convertItemFromServer(room: Room): Room {
        const copyOb: Room = Object.assign({}, room);
        return copyOb;
    }

    /**
     * Convert a Room to a JSON which can be sent to the server.
     */
    private convert( room: Room): Room {
        const copy: Room = Object.assign({}, room);
        return copy;
    }

    async exportCSV(req?: any): Promise<HttpResponse<Blob>> {
        const file =  await this.http.post<Blob>(
            `${this.reportUrl}Room/csv`, req['filter'],
            {responseType: 'blob' as 'json', observe : 'response'}
        ).toPromise();
        return file;
    }

    filter(req?: any): Observable<HttpResponse<Room[]>> {
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
        return this.http.post<Room[]>(newresourceUrl, req['filter'], {  observe: 'response' })
            .pipe(
                // map((res: HttpResponse<Member[]>) => this.convertArrayResponse(res))
                tap(results => console.log('raw ', results ) )
                    // console.log('observable ', billerCompanies)
                );

    }

}

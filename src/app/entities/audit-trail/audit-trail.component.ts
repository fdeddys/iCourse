import { Component, OnInit, Inject, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { AuditTrail } from './audit-trail.model';
import { AuditTrailService } from './audit-trail.service';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { NO_DATA_GRID_MESSAGE, TOTAL_RECORD_PER_PAGE } from '../../shared/constant/base-constant';
import { MatActionButtonComponent } from '../../shared/templates/mat-action-button.component';

@Component({
    selector: 'app-audit-trail',
    templateUrl: './audit-trail.component.html',
    styleUrls: ['./audit-trail.component.css']
})
export class AuditTrailComponent {

    private gridApi;
    private gridColumnApi;
    auditTrails: AuditTrail[];
    // auditTrail: AuditTrail;

    messageNoData: string = NO_DATA_GRID_MESSAGE;
    curPage = 1;
    totalData = 0;
    totalRecord = TOTAL_RECORD_PER_PAGE;
    // menuName = '';

    gridOptions = {
        columnDefs: [
            // { headerName: 'Name', field: 'name', checkboxSelection: true, width: 250, pinned: 'left', editable: true },
            { headerName: 'No', field: 'nourut', width: 100, pinned: 'left', editable: false },
            { headerName: 'Activity', field: 'activity', width: 150,  editable: false },
            { headerName: 'Insert', field: 'insertDate', width: 200 },
            { headerName: 'Value', field: 'afterValue', width: 950 },
        ],
        rowData: this.auditTrails,
        enableSorting: true,
        enableFilter: true,
        pagination: true,
        paginationPageSize: 10,
        suppressPaginationPanel : true,
        localeText: {noRowsToShow: this.messageNoData},
        frameworkComponents: {
            actionRenderer: MatActionButtonComponent
        }
    };

    constructor(
        private dialog: MatDialog,
        private auditTrailService: AuditTrailService,
        private route: ActivatedRoute
    ) { }

    loadAll(page) {
        console.log('Start call function all header');
        this.auditTrailService.query({
            tgl1: '2018-06-01',
            tgl2: '2018-06-30',
            page: page,
            count: this.totalRecord,
            // size: this.itemsPerPage,
            // sort: this.sort()
        })
        .subscribe(
                (res: HttpResponse<AuditTrail[]>) => this.onSuccess(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { console.log('finally'); }
        );
    }

    // load(id) {
    //     this.auditTrailService.find(id)
    //         .subscribe((productResponse: HttpResponse<AuditTrail>) => {
    //             this.auditTrail = productResponse.body;
    //         });
    // }

    // ngOnInit() {
    //     console.log('this.route : ', this.route);
    //     if (this.route.snapshot.routeConfig.path === 'non-auditTrail') {
    //         this.menuName = 'Non-AuditTrail';
    //     } else if (this.route.snapshot.routeConfig.path === 'auditTrail') {
    //         this.menuName = 'AuditTrail';
    //     }
    // }

    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;

        this.loadAll(this.curPage);
    }

    private onSuccess(data, headers) {
        console.log('success..', data);
        this.auditTrails = data.content;
        for (let index = 0; index < this.auditTrails.length; index++) {
            this.auditTrails[index].nourut = index + 1;
        }
        this.gridApi.setRowData(this.auditTrails);
        this.totalData = data.totalElements;
    }

    private onError(error) {
        console.log('error..');
    }

    public onPaginateChange($event): void {
        // console.log('events ', $event);
        this.curPage = $event.pageIndex + 1;
        this.loadAll(this.curPage);
    }

}


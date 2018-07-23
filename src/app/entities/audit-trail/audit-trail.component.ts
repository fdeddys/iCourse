import { Component, OnInit, Inject, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { AuditTrail } from './audit-trail.model';
import { AuditTrailService } from './audit-trail.service';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDatepickerInputEvent } from '@angular/material';

import { GRID_THEME, NO_DATA_GRID_MESSAGE, TOTAL_RECORD_PER_PAGE } from '../../shared/constant/base-constant';
import { MatActionButtonComponent } from '../../shared/templates/mat-action-button.component';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-audit-trail',
    templateUrl: './audit-trail.component.html',
    styleUrls: ['./audit-trail.component.css', '../../layouts/content/content.component.css']
})
export class AuditTrailComponent implements OnInit {


    private gridApi;
    private gridColumnApi;
    auditTrails: AuditTrail[];
    // auditTrail: AuditTrail;
    theme: String = GRID_THEME;
    messageNoData: string = NO_DATA_GRID_MESSAGE;
    curPage = 1;
    totalData = 0;
    totalRecord = TOTAL_RECORD_PER_PAGE;
    tgl1: any;
    tgl2: any;
    // menuName = '';

    dateStatCtrl: FormControl;
    dateThruCtrl: FormControl;

    gridOptions = {
        columnDefs: [
            // { headerName: 'Name', field: 'name', checkboxSelection: true, width: 250, pinned: 'left', editable: true },
            { headerName: 'No', field: 'nourut', width: 100, pinned: 'left', editable: false },
            { headerName: 'Activity', field: 'activity', width: 150,  editable: false },
            { headerName: 'Insert', field: 'insertDate', width: 200 },
            { headerName: 'Value', field: 'afterValue', width: 950 },
            { headerName: 'User', field: 'userInput', width: 150 },
        ],
        rowData: this.auditTrails,
        enableSorting: true,
        enableFilter: true,
        pagination: true,
        paginationPageSize: 10,
        suppressPaginationPanel : true,
        enableColResize: true,
        localeText: {noRowsToShow: this.messageNoData},
        frameworkComponents: {
            actionRenderer: MatActionButtonComponent
        }
    };

    constructor(
        private dialog: MatDialog,
        private auditTrailService: AuditTrailService,
        private route: ActivatedRoute
    ) {
        this.dateStatCtrl = new FormControl();
        this.dateThruCtrl = new FormControl();
    }

    ngOnInit(): void {
        this.tgl1 = this.curDate();
        this.tgl2 = this.curDate();
        this.dateStatCtrl.setValue(new Date());
        this.dateThruCtrl.setValue(new Date());
    }

    loadAll(page) {
        console.log('Start call function all header');
        this.auditTrailService.query({
            tgl1: this.tgl1,
            tgl2: this.tgl2,
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
        if (data === null ) {
            this.auditTrails = [];
            this.totalData = 0;
        } else {
            this.auditTrails = data.content;
            for (let index = 0; index < this.auditTrails.length; index++) {
                this.auditTrails[index].nourut = index + 1;
            }
            this.totalData = data.totalElements;
        }
        this.gridApi.setRowData(this.auditTrails);
    }

    private onError(error) {
        console.log('error..');
    }

    public onPaginateChange($event): void {
        // console.log('events ', $event);
        this.curPage = $event.pageIndex + 1;
        this.loadAll(this.curPage);
    }

    public filter(): void {
        this.loadAll(this.curPage);
    }

    dateFormatter(params): string {
        const dt  = new Date(params.value);
        const year = dt.getFullYear();
        const mth = dt.getMonth() + 1;
        const day = dt.getDate();
        // return dt.toLocaleString(['id']);
        return year + '-' + (mth < 10 ? '0' + mth : mth) + '-' + (day < 10 ? '0' + day : day);
    }

    curDate(): string {
        const dt  = new Date();
        const year = dt.getFullYear();
        const mth = dt.getMonth() + 1;
        const day = dt.getDate();
        // return dt.toLocaleString(['id']);
        return year + '-' + (mth < 10 ? '0' + mth : mth) + '-' + (day < 10 ? '0' + day : day);
    }

    addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
        if (type === 'start') {
            this.tgl1 = this.dateFormatter(event);
            console.log('tgl 1 ==> ', this.tgl1);
        } else if (type === 'thru') {
            this.tgl2 = this.dateFormatter(event);
            console.log('tgl 2 ==> ', this.tgl2);
            // this.biller.dateThru = this.dateFormatter(event);
        }
    }
}


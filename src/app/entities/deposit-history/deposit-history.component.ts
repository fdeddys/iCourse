import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';

import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { DepositHistory } from './deposit-history.model';
import { DepositHistoryService } from './deposit-history.service';
import { DepositHistoryDialogComponent } from './deposit-history-dialog.component';
import { TranslateService } from '@ngx-translate/core';

import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatPaginator } from '@angular/material';
import { GRID_THEME, NO_DATA_GRID_MESSAGE, TOTAL_RECORD_PER_PAGE, REPORT_PATH } from '../../shared/constant/base-constant';
import { MatActionButtonComponent } from '../../shared/templates/mat-action-button.component';

@Component({
    selector: 'app-deposit-history',
    templateUrl: './deposit-history.component.html',
    styleUrls: ['./deposit-history.component.css']
})

export class DepositHistoryComponent implements OnInit {

    @ViewChild('downloadLink') private downloadLink: ElementRef;
    @ViewChild('paginator') private paginator: MatPaginator;

    private gridApi;
    private gridColumnApi;
    private resourceUrl = REPORT_PATH;

    depositHistories: DepositHistory[];

    messageNoData: string = NO_DATA_GRID_MESSAGE;
    curPage = 1;
    totalData = 0;
    totalRecord = TOTAL_RECORD_PER_PAGE;
    menuName = '';
    theme: String = GRID_THEME;

    filter: DepositHistoryFilter = {
        memberTypeId: null,
        transTypeId: null,
        amount: null,
        filDateFStart: null,
        filDateTStart: null,
    };

    gridOptions = {
        columnDefs: [
            // { headerName: 'Name', field: 'name', checkboxSelection: true, width: 250, pinned: 'left', editable: true },
            { headerName: 'No', field: 'no', width: 100, pinned: 'left', editable: false },
            { headerName: 'Member Code', field: 'memberCode', width: 150, pinned: 'left', editable: false },
            { headerName: 'Name', field: 'member.name', width: 300, pinned: 'left', editable: false },
            { headerName: 'Date Start', field: 'dateStart', width: 185, pinned: 'left', editable: false },
            { headerName: 'Date Through', field: 'dateThru', width: 185, pinned: 'left', editable: false },
            { headerName: ' ', width: 80, cellRenderer: 'actionRenderer', pinned: 'left', editable: false}
        ],
        rowData: this.depositHistories,
        enableSorting: true,
        enableFilter: true,
        // rowSelection: "multiple"
        pagination: true,
        enableColResize: true,
        paginationPageSize: 10,
        suppressPaginationPanel : true,
        localeText: {noRowsToShow: this.messageNoData},
        frameworkComponents: {
            actionRenderer: MatActionButtonComponent
        }
    };

    constructor(
        translate: TranslateService,
        private depositHistoryService: DepositHistoryService,
        private dialog: MatDialog,
        private route: ActivatedRoute,
    ) {
        translate.use('en');
    }

    ngOnInit() {
        console.log('this.route : ', this.route);
    }

    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;

        // console.log(this.gridApi);
        // console.log(this.gridColumnApi);

        // this.loadAll(this.curPage);
        this.filterBtn('');
    }

    dateFormatter(params): string {
        const dt  = new Date(params);
        const year = dt.getFullYear();
        const mth = dt.getMonth() + 1;
        const day = dt.getDate();
        // return dt.toLocaleString(['id']);
        return year + '-' + (mth < 10 ? '0' + mth : mth) + '-' + (day < 10 ? '0' + day : day);
    }

    onRowClicked(e) {
        if (e.event.target !== undefined) {
            const data = e.data;
            const actionType = e.event.target.getAttribute('data-action-type');

            switch (actionType) {
                case 'view':
                    // console.log('Data row : ', data);
                    return this.openDialog('view', data);
                case 'edit':
                    // console.log('Data row : ', data);
                    return this.openDialog('edit', data);
            }
        }
    }

    openDialog(mode, data): void {
        const datasend = {
            mode : 'create',
            modeTitle : 'Add',
            rowData : {},
        };
        if (mode !== 'create') {
            datasend.mode = mode;
            datasend.modeTitle = (mode === 'view' ? 'View' : 'Edit');
            datasend.rowData = data;
        }
        const dialogRef = this.dialog.open(DepositHistoryDialogComponent, {
            width: '1000px',
            // height: '700px',
            data: datasend
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            // this.animal = result;
            // this.loadAll(this.curPage);
        });
    }

    actionfilter(): void {
        this.filterBtn(1);
        this.paginator.pageIndex = 0;
    }

    filterBtn(page): void {
        if (page !== '') {
            this.curPage = page;
        }

        console.log('this.filter : ', this.filter);
        this.depositHistoryService.filter({
            page: this.curPage,
            count: this.totalRecord,
            filter: this.filter,
        })
        .subscribe(
            (res: HttpResponse<DepositHistory[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { console.log('finally'); }
        );
    }

    private onSuccess(data, headers) {
        console.log('success..', data);
        this.depositHistories = data.content;
        for (let index = 0; index < this.depositHistories.length; index++) {
            this.depositHistories[index].no = index + 1;
        }
        this.gridApi.setRowData(this.depositHistories);
        this.totalData = data.totalElements;
    }

    private onError(error) {
        console.log('error..');
    }

    public async exportCSV(reportType): Promise<void> {
        const blob = await this.depositHistoryService.exportCSV(reportType, this.filter).then(
        (resp) => {
            const url = window.URL.createObjectURL(resp.body);
            const link = this.downloadLink.nativeElement;
            link.href = url;
            link.download = resp.headers.get('File-Name');
            link.click();
            window.URL.revokeObjectURL(url);
        });
    }

    public onPaginateChange($event): void {
        this.curPage = $event.pageIndex + 1;
        // this.loadAll(this.curPage);
        this.filterBtn('');
    }
}

export interface DepositHistoryFilter {
    memberTypeId?: number;
    transTypeId?: number;
    amount?: number;
    filDateFStart?: string;
    filDateTStart?: string;
}

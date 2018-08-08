import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';

import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Deposit } from './deposit.model';
import { DepositService } from './deposit.service';
import { DepositDialogComponent } from './deposit-dialog.component';

import { DepositHistory } from '../deposit-history/deposit-history.model';
import { DepositHistoryService } from '../deposit-history/deposit-history.service';
import { TransType } from '../transaction-type/transaction-type.model';
import { TransTypeService } from '../transaction-type/transaction-type.service';
import { Biller } from '../biller/biller.model';
import { BillerService } from '../biller/biller.service';
import { TranslateService } from '@ngx-translate/core';

import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatPaginator } from '@angular/material';
import { GRID_THEME, NO_DATA_GRID_MESSAGE, TOTAL_RECORD_PER_PAGE, REPORT_PATH } from '../../shared/constant/base-constant';
import { MatActionButtonComponent } from '../../shared/templates/mat-action-button.component';

@Component({
    selector: 'app-deposit',
    templateUrl: './deposit.component.html',
    styleUrls: ['./deposit.component.css']
})

export class DepositComponent implements OnInit {

    @ViewChild('downloadLink') private downloadLink: ElementRef;
    @ViewChild('paginator') private paginator: MatPaginator;

    private gridApi;
    private gridColumnApi;
    private resourceUrl = REPORT_PATH;
    dateFStartCtrl: FormControl;
    dateTStartCtrl: FormControl;

    deposits: Deposit[];
    billerList = [];
    transTypeList = [];

    messageNoData: string = NO_DATA_GRID_MESSAGE;
    curPage = 1;
    totalData = 0;
    totalRecord = TOTAL_RECORD_PER_PAGE;
    menuName = '';
    theme: String = GRID_THEME;

    filter: DepositFilter = {
        memberTypeId: null,
        transTypeCode: null,
        transDate: null,
        amount: null,
        description: '',
        filDateFStart: null,
        filDateTStart: null,
    };

    filChkBox = {
        start: false,
        through: false
    };

    gridOptions = {
        columnDefs: [
            { headerName: 'No', field: 'no', width: 100, pinned: 'left', editable: false },
            { headerName: 'Member Type', field: 'memberName', width: 150, editable: false },
            { headerName: 'Debit', field: 'debit', width: 150, editable: false },
            { headerName: 'Credit', field: 'credit', width: 150, editable: false },
            { headerName: 'Transaction Type', field: 'transTypeDesc', width: 150, editable: false },
            { headerName: 'Transaction Date', field: 'transDate', width: 150, editable: false },
            { headerName: 'Description', field: 'description', width: 300, editable: false },
            // { headerName: ' ', width: 80, cellRenderer: 'actionRenderer', editable: false}
        ],
        rowData: this.deposits,
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
        private depositService: DepositService,
        private depositHistoryService: DepositHistoryService,
        private billerService: BillerService,
        private transTypeService: TransTypeService,
        private dialog: MatDialog,
        private route: ActivatedRoute,
    ) {
        translate.use('en');
        this.dateFStartCtrl = new FormControl();
        this.dateTStartCtrl = new FormControl();
    }

    ngOnInit() {
        console.log('this.route : ', this.route);
        if (this.route.snapshot.routeConfig.path === 'manual-deposit') {
            this.menuName = 'Manual Deposit';
            this.filter.transTypeCode = '8';
        } else if (this.route.snapshot.routeConfig.path === 'manual-refund') {
            this.menuName = 'Manual Refund';
            this.filter.transTypeCode = '7';
        }

        this.dateFStartCtrl.disable();
        this.dateTStartCtrl.disable();

        this.transTypeService.query({
            page: 1,
            count: 100,
        })
        .subscribe(
            (res: HttpResponse<TransType[]>) => this.onSuccessTransType(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { console.log('finally'); }
        );

        this.billerService.findIsDeposit()
        .subscribe(
                (res: HttpResponse<Biller[]>) => this.onSuccessBiller(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { console.log('finally'); }
        );
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
        console.log('isi trans type list ======> ', this.transTypeList);
        const datasend = {
            mode : 'create',
            modeTitle : 'Add',
            transTypeData : this.transTypeList,
            billerData : this.billerList,
            rowData : {
                memberTypeId: null,
                amount: null,
                transTypeId: null,
                transDate: null,
                description: null
            },
        };
        if (mode !== 'create') {
            datasend.mode = mode;
            datasend.modeTitle = (mode === 'view' ? 'View' : 'Edit');
            datasend.rowData = data;
        }
        const dialogRef = this.dialog.open(DepositDialogComponent, {
            width: '700px',
            // height: '700px',
            data: datasend
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            // this.animal = result;
            // this.loadAll(this.curPage);
            this.filterBtn('');
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

        this.filter.filDateFStart = (this.dateFStartCtrl.value === null ? null : this.dateFormatter(this.dateFStartCtrl.value));
        this.filter.filDateTStart = (this.dateTStartCtrl.value === null ? null : this.dateFormatter(this.dateTStartCtrl.value));
        console.log('this.filter : ', this.filter);
        this.depositService.filter({
            page: this.curPage,
            count: this.totalRecord,
            filter: this.filter,
        })
        .subscribe(
            (res: HttpResponse<Deposit[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { console.log('finally'); }
        );
    }

    private onSuccessTransType(data, headers) {
        console.log('data.content trans type : ', data.content);
        // this.transTypeList = data.content;
        if (this.route.snapshot.routeConfig.path === 'manual-deposit') {
            this.transTypeList = _.filter(data.content, function(o) { return o.code === '8'; });
        } else if (this.route.snapshot.routeConfig.path === 'manual-refund') {
            this.transTypeList = _.filter(data.content, function(o) { return o.code === '7'; });
        }
    }

    private onSuccessBiller(data, headers) {
        console.log('data.content member type : ', data);
        this.billerList = data;
    }

    private onSuccess(data, headers) {
        console.log('success..', data);
        this.deposits = data.content;
        for (let index = 0; index < this.deposits.length; index++) {
            this.deposits[index].no = index + 1;
        }
        this.gridApi.setRowData(this.deposits);
        this.totalData = data.totalElements;
    }

    private onError(error) {
        console.log('error..');
    }

    public async exportCSV(reportType): Promise<void> {

        // if (this.route.snapshot.routeConfig.path === 'manual-deposit') {
        //     this.menuName = 'Manual Deposit';
        //     this.filter.transTypeCode = '8';
        // } else if (this.route.snapshot.routeConfig.path === 'manual-refund') {
        //     this.menuName = 'Manual Refund';
        //     this.filter.transTypeCode = '7';
        // }
        const blob = await this.depositService.exportCSV({filter: this.filter }, this.filter.transTypeCode).then(
            (resp) => {
                const url = window.URL.createObjectURL(resp.body);
                const link = document.createElement('a');
                document.body.appendChild(link);
                link.setAttribute('style', 'display: none');
                link.href = url;
                link.download = resp.headers.get('File-Name');
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
            });
        }

    public onPaginateChange($event): void {
        this.curPage = $event.pageIndex + 1;
        // this.loadAll(this.curPage);
        this.filterBtn('');
    }

    chkBoxChgS(evt) {
        console.log('chkBoxChgT(evt) : ', evt);
        if (evt.checked) {
            this.dateFStartCtrl.enable();
            this.dateTStartCtrl.enable();
        } else {
            this.dateFStartCtrl.disable();
            this.dateTStartCtrl.disable();
            this.dateFStartCtrl.setValue(null);
            this.dateTStartCtrl.setValue(null);
        }
    }
}

export interface DepositFilter {
    memberTypeId?: number;
    transTypeCode?: string;
    transDate?: string;
    amount?: number;
    description?: string;
    filDateFStart?: string;
    filDateTStart?: string;
}


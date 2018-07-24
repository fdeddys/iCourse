import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { TransList } from './transaction-list.model';
import { TransListService } from './transaction-list.service';
import { TransListDialogComponent } from './transaction-list-dialog.component';

import { MatDialog, MatPaginator } from '@angular/material';
import { MatActionButtonComponent } from '../../shared/templates/mat-action-button.component';
import { GRID_THEME, CSS_BUTTON, NO_DATA_GRID_MESSAGE, TOTAL_RECORD_PER_PAGE } from '../../shared/constant/base-constant';
import { REPORT_PATH } from '../../shared/constant/base-constant';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-transaction-list',
    templateUrl: './transaction-list.component.html',
    styleUrls: ['./transaction-list.component.css', '../../layouts/content/content.component.css']
})

export class TransListComponent implements OnInit {
    private gridApi;
    private gridColumnApi;
    private resourceUrl = REPORT_PATH;
    entityName: String = 'Transaction Type';
    @ViewChild(MatPaginator) paginator: MatPaginator;

    transList: TransList[];

    cssButton = CSS_BUTTON;
    theme: String = GRID_THEME;
    filter: TransListFilter = {
        requestor: null,
        responder: null,
        transType: null,
        billerProduct: null,
        buyPrice: null,
        fee: null,
        profitRtsm: null,
        sellPrice: null,
        sellPriceFromTable: null,
        promotionId: null,
        amount: null,
        transmissionDateTime: '',
        stan: null,
        rrn: '',
        rrnRequestor: '',
        rcInternal: '',
        rcRequestor: '',
        rcResponder: '',
        tsRcvRequestor: '',
        tsSndRequestor: '',
        tsRcvResponder: '',
        tsSndResponder: '',
        msg_rcv_requestor: '',
        msg_snd_requestor: '',
        msg_snd_responder: '',
        msg_rcv_responder: '',
    };
    curPage = 1;
    totalData = 0;
    totalRecord = TOTAL_RECORD_PER_PAGE;
    messageNoData: string = NO_DATA_GRID_MESSAGE;

    gridOptions = {
        columnDefs: [
            { headerName: 'No', field: 'no', width: 100, minWidth: 100, maxWidth: 100, pinned: 'left', editable: false },
            { headerName: 'Transmission Date', field: 'transmissionDateTime', width: 200, pinned: 'left', editable: false },
            { headerName: 'Requestor', field: 'requestor.name', width: 200 },
            { headerName: 'Responder', field: 'responder.name', width: 200 },
            { headerName: 'Transaction Type', field: 'transType.name', width: 200 },
            { headerName: 'Product', field: 'billerProduct.name', width: 200 },
            { headerName: 'Buy Price', field: 'buyPrice', width: 150 },
            { headerName: 'Sell Price', field: 'sellPrice', width: 150 },
            { headerName: 'Amount', field: 'amount', width: 150 },
            { headerName: 'RC Internal', field: 'rcInternal', width: 150 },
            { headerName: ' ', width: 150, minWidth: 150, maxWidth: 150, cellRenderer: 'actionRenderer'}
        ],
        rowData: this.transList,
        enableSorting: true,
        enableFilter: true,
        enableColResize: true,
        // rowSelection: "multiple"
        pagination: true,
        paginationPageSize: 10,
        suppressPaginationPanel : true,
        localeText: {noRowsToShow: this.messageNoData},
        frameworkComponents: {
            // checkboxRenderer: MatCheckboxComponent,
            actionRenderer: MatActionButtonComponent
        }
    };
    constructor(
        translate: TranslateService,
        private transListService: TransListService,
        private dialog: MatDialog,
    ) {
        translate.use('en');
    }

    ngOnInit() {

    }

    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;

        // console.log(this.gridApi);
        // console.log(this.gridColumnApi);
        // params.api.sizeColumnsToFit();
        // this.loadAll(this.curPage);
        this.filterData('');
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
            // billerCompanyData : this.billerCompanyList,
            // billerTypeData : this.billerTypeList,
            // searchByData : this.searchByList,
            // statusData : this.statusList,
            // memberData : this.memberList,
            rowData : {
                id: null,
                id_requestor: null,
                id_responder: null,
                trans_type: null,
                product_id: null,
                buy_price: null,
                fee: null,
                profit_rtsm: null,
                sell_price: null,
                sell_price_from_table: null,
                promotion_id: null,
                amount: null,
                transmission_date_time: null,
                stan: null,
                rrn: null,
                rrn_requestor: null,
                rc_internal: null,
                rc_requestor: null,
                rc_responder: null,
                ts_rcv_requestor: null,
                ts_snd_requestor: null,
                ts_rcv_responder: null,
                ts_snd_responder: null,
                msg_rcv_requestor: null,
                msg_snd_requestor: null,
                msg_snd_responder: null,
                msg_rcv_responder: null,
            },
        };
        if (mode !== 'create') {
            datasend.mode = mode;
            datasend.modeTitle = (mode === 'view' ? 'View' : 'Edit');
            datasend.rowData = data;
        }
        const dialogRef = this.dialog.open(TransListDialogComponent, {
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
        this.paginator._pageIndex = 0;
        this.filterData(1);
    }

    loadAll(page) {
        console.log('Start call function all header');
        this.transListService.query({
            page: page,
            count: this.totalRecord,
        })
        .subscribe(
            (res: HttpResponse<TransList[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { console.log('finally'); }
        );
    }

    filterData(page): void {
        if (page !== '') {
            this.curPage = page;
        }
        this.transListService.filter({
            page: this.curPage,
            count: this.totalRecord,
            filter: this.filter,
        })
        .subscribe(
            (res: HttpResponse<TransList[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { console.log('finally'); }
        );
    }

    dateFormatter(params): string {
        const dt  = new Date(params);
        const year = dt.getFullYear();
        const mth = dt.getMonth() + 1;
        const day = dt.getDate();
        // return dt.toLocaleString(['id']);
        return year + '-' + (mth < 10 ? '0' + mth : mth) + '-' + (day < 10 ? '0' + day : day);
    }

    private onSuccess(data, headers) {
        if (data === null || data.content.length < 0) {
            this.gridApi.setRowData(this.transList);
            return;
        }
        this.transList = data.content;
        let i = 1;
        for (const transL of this.transList) {
            transL.no = i++;
            transL.transmissionDateTime = this.dateFormatter(transL.transmissionDateTime);
        }
        this.gridApi.setRowData(this.transList);
        this.totalData = data.totalElements;
    }

    private onError(error) {
        console.log('error..');
    }

    public onPaginateChange($event): void {
        this.curPage = $event.pageIndex + 1;
        // this.loadAll(this.curPage);
        this.filterData('');
    }

    public async exportCSV(reportType): Promise<void> {
        const blob = await this.transListService.exportCSV();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        document.body.appendChild(link);
        link.setAttribute('style', 'display: none');
        link.href = url;
        link.download = 'Transations.csv';
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    }
}

export interface TransListFilter  {
    id?: number;
    requestor?: any;
    responder?: any;
    transType?: number;
    billerProduct?: number;
    buyPrice?: number;
    fee?: number;
    profitRtsm?: number;
    sellPrice?: number;
    sellPriceFromTable?: number;
    promotionId?: number;
    amount?: number;
    transmissionDateTime?: string;
    stan?: number;
    rrn?: string;
    rrnRequestor?: string;
    rcInternal?: string;
    rcRequestor?: string;
    rcResponder?: string;
    tsRcvRequestor?: string;
    tsSndRequestor?: string;
    tsRcvResponder?: string;
    tsSndResponder?: string;
    msg_rcv_requestor?: string;
    msg_snd_requestor?: string;
    msg_snd_responder?: string;
    msg_rcv_responder?: string;
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { TransList } from './transaction-list.model';
import { TransListService } from './transaction-list.service';
import { TransListDialogComponent } from './transaction-list-dialog.component';

import { FormControl } from '@angular/forms';
import { MatDialog, MatPaginator } from '@angular/material';
import { MatActionButtonComponent } from '../../shared/templates/mat-action-button.component';
import { GRID_THEME, CSS_BUTTON, NO_DATA_GRID_MESSAGE, TOTAL_RECORD_PER_PAGE } from '../../shared/constant/base-constant';
import { REPORT_PATH } from '../../shared/constant/base-constant';
import { TranslateService } from '@ngx-translate/core';

import { TransType } from '../transaction-type/transaction-type.model';
import { TransTypeService } from '../transaction-type/transaction-type.service';
import { Product } from '../product/product.model';
import { ProductService } from '../product/product.service';
import { Member } from '../member/member.model';
import { MemberService } from '../member/member.service';

@Component({
    selector: 'app-transaction-list',
    templateUrl: './transaction-list.component.html',
    styleUrls: ['./transaction-list.component.css']
})

export class TransListComponent implements OnInit {
    private gridApi;
    private gridColumnApi;
    private resourceUrl = REPORT_PATH;
    entityName: String = 'Transaction Type';
    @ViewChild(MatPaginator) paginator: MatPaginator;

    transList: TransList[];
    transTypeList: TransType[];
    productList: Product[];
    requestorList: Member[];
    responderList: Member[];

    cssButton = CSS_BUTTON;
    theme: String = GRID_THEME;
    filter: TransListFilter = {
        filDateFStart: null,
        filDateTStart: null,
        requestorId: null,
        responderId: null,
        transTypeId: null,
        productId: null
    };
    curPage = 1;
    totalData = 0;
    totalRecord = TOTAL_RECORD_PER_PAGE;
    messageNoData: string = NO_DATA_GRID_MESSAGE;
    dateFStartCtrl: FormControl;
    dateTStartCtrl: FormControl;

    gridOptions = {
        columnDefs: [
            { headerName: 'No', field: 'no', width: 70, minWidth: 70, maxWidth: 70, pinned: 'left', editable: false },
            { headerName: 'Transaction Date', field: 'transmissionDateTime', width: 150, pinned: 'left', editable: false },
            { headerName: 'Requestor', field: 'requestor.name', width: 120 },
            { headerName: 'Responder', field: 'responder.name', width: 120 },
            { headerName: 'Transaction Type', field: 'transType.name', width: 150 },
            { headerName: 'Product', field: 'product.name', width: 200 },
            { headerName: 'Buy Price', field: 'buyPrice', width: 100 },
            { headerName: 'Sell Price', field: 'sellPrice', width: 100 },
            { headerName: 'RC Internal', field: 'rcInternalPrev', width: 120 },
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
        private transTypeService: TransTypeService,
        private productService: ProductService,
        private memberService: MemberService,
        private dialog: MatDialog,
    ) {
        translate.use('en');
        this.dateFStartCtrl = new FormControl();
        this.dateTStartCtrl = new FormControl();
    }

    ngOnInit() {
        this.transTypeService.filter({
            page: this.curPage,
            count: this.totalRecord,
            filter: {
                'name': ''
            },
        })
        .subscribe(
            (res: HttpResponse<TransType[]>) => this.onSuccessTransType(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { console.log('finally'); }
        );

        this.memberService.query({
            page: 1,
            count: 10000,
        })
        .subscribe(
                (res: HttpResponse<Member[]>) => this.onSuccessMemb(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { console.log('finally'); }
        );

        this.memberService.findNotAsBiller({
            page: 1,
            count: 10000,
        })
        .subscribe(
                (res: HttpResponse<Member[]>) => this.onSuccessMembNon(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { console.log('finally'); }
        );

        this.productService.filter({
            page: this.curPage,
            count: this.totalRecord,
            filter: {
                name: null,
                productCode: null
            },
        })
        .subscribe(
            (res: HttpResponse<Member[]>) => this.onSuccessProduct(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { console.log('finally'); }
        );
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
            transL.rcInternalPrev = (transL.rcInternal.includes('00') ? 'Approve' : 'Decline');
            // transL.transmissionDateTime = this.dateFormatter(transL.transmissionDateTime);
            transL.transmissionDateTime = new Date(transL.transmissionDateTime).toLocaleString('id');
        }
        this.gridApi.setRowData(this.transList);
        this.totalData = data.totalElements;
    }

    private onSuccessTransType(data, headers) {
        console.log('isi response trans type ==> ', data);
        this.transTypeList = data.content;
    }

    private onSuccessMemb(data, headers) {
        console.log('isi response responder ==> ', data);
        this.responderList = data.content;
    }

    private onSuccessMembNon(data, headers) {
        console.log('isi response requestor ==> ', data);
        this.requestorList = data.content;
    }

    private onSuccessProduct(data, headers) {
        console.log('isi response product ==> ', data);
        this.productList = data.content;
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
        const blob = await this.transListService.exportCSV().then(
        (resp) => {
            // console.log('file name : ', resp.headers.get('File-Name'));
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
}

export interface TransListFilter  {
    filDateFStart: null;
    filDateTStart: null;
    requestorId?: any;
    responderId?: any;
    transTypeId?: number;
    productId?: number;
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { TransList } from './transaction-list.model';
import { TransListService } from './transaction-list.service';
import { TransListDialogComponent } from './transaction-list-dialog.component';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

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
import { Biller } from '../biller/biller.model';
import { BillerService } from '../biller/biller.service';
import { ResponseCode } from '../response-code/response-code.model';
import { ResponseCodeService } from '../response-code/response-code.service';

@Component({
    selector: 'app-transaction-list',
    templateUrl: './transaction-list.component.html',
    styleUrls: ['./transaction-list.component.css']
})

export class TransListComponent implements OnInit {
    private gridApi;
    private gridColumnApi;
    private resourceUrl = REPORT_PATH;
    entityName: String = '';
    @ViewChild(MatPaginator) paginator: MatPaginator;

    transList: TransList[];
    transTypeList: TransType[];
    productList: Product[];
    requestorList: Biller[];
    responderList: Biller[];
    respCodeInternalList: any[];

    cssButton = CSS_BUTTON;
    theme: String = GRID_THEME;
    filter: TransListFilter = {
        filDateFStart: null,
        filDateTStart: null,
        requestorId: null,
        responderId: null,
        transTypeCode: null,
        productId: null,
        rcInternal: null,
        mode: 1
    };
    curPage = 1;
    totalData = 0;
    totalRecord = TOTAL_RECORD_PER_PAGE;
    messageNoData: string = NO_DATA_GRID_MESSAGE;
    dateFStartCtrl: FormControl;
    dateTStartCtrl: FormControl;

    requestorCtrl: FormControl;
    filteredReq: Observable<any[]>;
    responderCtrl: FormControl;
    filteredRes: Observable<any[]>;
    productCtrl: FormControl;
    filteredProduct: Observable<any[]>;

    gridOptions = {
        columnDefs: [
            { headerName: 'No', field: 'no', width: 70, minWidth: 70, maxWidth: 70, pinned: 'left', editable: false },
            { headerName: 'Transaction Date', field: 'transmissionDateTime', width: 150, pinned: 'left', editable: false },
            { headerName: 'Requestor', field: 'requestor.member.name', width: 120 },
            { headerName: 'Responder', field: 'responder.member.name', width: 120 },
            { headerName: 'Transaction Type', field: 'transType.name', width: 150 },
            { headerName: 'Product', field: 'product.name', width: 200 },
            // { headerName: 'Buy Price', field: 'buyPrice', width: 100 },
            { headerName: 'Amount', field: 'amount', width: 100 },
            { headerName: 'Status', field: 'rcInternal', width: 150,  valueFormatter: this.statusFormat  },
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
        private billerService: BillerService,
        private responseCodeService: ResponseCodeService,
        private dialog: MatDialog,
        private route: ActivatedRoute,
    ) {
        translate.use('en');
        this.dateFStartCtrl = new FormControl();
        this.dateTStartCtrl = new FormControl();
        this.requestorCtrl = new FormControl();
        this.responderCtrl = new FormControl();
        this.productCtrl = new FormControl();
    }

    statusFormat(params) {
        console.log('aaaaaaaa', params);
        switch (params.value) {
            case '00': return 'Approved';
            case 'SS': return 'Approved';
            case 'PP': return 'Pending';
            default :
                return 'Failed / Declined';
        }
        // return (params.value === 'ACTIVE' ? 'AVAILABLE' : 'DISCONTINUED');
    }

    filterRequestor(name: string) {
        return this.requestorList.filter(requestor =>
        requestor.member.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
    }

    filterResponder(name: string) {
        return this.responderList.filter(responder =>
        responder.member.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
    }

    filterProduct(name: string) {
        return this.productList.filter(product =>
        product.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
    }

    displayFnReq(biller?: Biller): string | undefined {
        return biller ? biller.member.name + ' (' + biller.memberCode + ')' : undefined;
    }

    displayFnRes(biller?: Biller): string | undefined {
        return biller ? biller.member.name + ' (' + biller.memberCode + ')' : undefined;
    }

    displayFnPrd(product?: Product): string | undefined {
        return product ? product.name : undefined;
    }

    ngOnInit() {
        if (this.route.snapshot.routeConfig.path === 'transaction') {
            this.entityName = 'Trans';
        } else if (this.route.snapshot.routeConfig.path === 'transaction-adjust') {
            this.entityName = 'TransAdjust';
        }

        this.transTypeService.filter({
            page: this.curPage,
            count: this.totalRecord,
            filter: {
                'name': ''
            },
        }, true)
        .subscribe(
            (res: HttpResponse<TransType[]>) => this.onSuccessTransType(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { console.log('finally'); }
        );

        this.billerService.filter({
            allData: 1,
            page: this.curPage,
            count: this.totalRecord,
            filter: {
                memberName: '',
                filDateFStart: null,
                filDateTStart: null,
                filDateFThru: null,
                filDateTThru: null
            },
        })
        .subscribe(
            (res: HttpResponse<Biller[]>) => this.onSuccessBill(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { console.log('finally'); }
        );

        this.billerService.filter({
            allData: 0,
            page: this.curPage,
            count: this.totalRecord,
            filter: {
                memberName: '',
                filDateFStart: null,
                filDateTStart: null,
                filDateFThru: null,
                filDateTThru: null
            },
        })
        .subscribe(
            (res: HttpResponse<Biller[]>) => this.onSuccessBillNon(res.body, res.headers),
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
            (res: HttpResponse<Product[]>) => this.onSuccessProduct(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { console.log('finally'); }
        );

        // this.responseCodeService.filter({
        //     allData: 0,
        //     page: 1,
        //     count: 10000,
        //     filter: this.filter,
        // })
        // .subscribe(
        //         (res: HttpResponse<ResponseCode[]>) => {
        //              this.onSuccessRespCdInternal(res.body, res.headers);
        //         },
        //         (res: HttpErrorResponse) => this.onError(res.message),
        //         () => { console.log('finally'); }
        // );

        this.respCodeInternalList = [
            {responseCode: 'SS', description: 'Approved'},
            {responseCode: 'PP', description: 'Pending'},
            {responseCode: 'FF', description: 'Failed'}
        ];
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
            datasend.mode = (this.route.snapshot.routeConfig.path === 'transaction-adjust' ? 'edit' : 'view');
            datasend.modeTitle = (this.route.snapshot.routeConfig.path === 'transaction-adjust' ? 'Edit' : 'View');
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
            if (this.route.snapshot.routeConfig.path === 'transaction-adjust') {
                this.filterData('');
            }
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
        this.filter.filDateFStart = (this.dateFStartCtrl.value === null ? null : this.dateFormatter(this.dateFStartCtrl.value));
        this.filter.filDateTStart = (this.dateTStartCtrl.value === null ? null : this.dateFormatter(this.dateTStartCtrl.value));
        this.filter.requestorId = (this.requestorCtrl.value === null ? null : this.requestorCtrl.value.id);
        this.filter.responderId = (this.responderCtrl.value === null ? null : this.responderCtrl.value.id);
        this.filter.productId = (this.productCtrl.value === null ? null : this.productCtrl.value.id);
        if (this.route.snapshot.routeConfig.path === 'transaction-adjust') {
            this.filter.rcInternal = 'PP';
            this.filter.mode = 2;
        }
        console.log(this.filter);

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
        let urut = data.pageable.offset + 1;
        for (const transL of this.transList) {
            transL.no = urut++;
            // transL.rcInternalPrev = (transL.rcInternal.includes('00') ? 'Approve' : 'Decline');
            switch (transL.rcInternal) {
                case 'SS':
                    transL.rcInternalPrev = 'Approve';
                    break;
                case 'PP':
                    transL.rcInternalPrev = 'Pending';
                    break;
                case 'FF':
                    transL.rcInternalPrev = 'Failed';
                    break;
            }
            // transL.transmissionDateTime = this.dateFormatter(transL.transmissionDateTime);
            transL.transmissionDateTime = new Date(transL.transmissionDateTime).toLocaleString('id');
        }
        this.gridApi.setRowData(this.transList);
        this.totalData = data.totalElements;
    }

    private onSuccessTransType(data, headers) {
        console.log('isi response trans type ==> ', data);
        this.transTypeList = data;
    }

    private onSuccessBill(data, headers) {
        console.log('isi response responder ==> ', data);
        this.responderList = data.content;
        this.filteredRes = this.responderCtrl.valueChanges
        .pipe(
            startWith<string | Biller>(''),
            map(value => typeof value === 'string' ? value : value.member.name),
            map(name => name ? this.filterResponder(name) : this.responderList.slice())
        );
    }

    private onSuccessBillNon(data, headers) {
        console.log('isi response requestor ==> ', data);
        this.requestorList = data.content;
        this.filteredReq = this.requestorCtrl.valueChanges
        .pipe(
            startWith<string | Biller>(''),
            map(value => typeof value === 'string' ? value : value.member.name),
            map(name => name ? this.filterRequestor(name) : this.requestorList.slice())
        );
    }

    private onSuccessProduct(data, headers) {
        console.log('isi response product ==> ', data);
        this.productList = data.content;
        this.filteredProduct = this.productCtrl.valueChanges
        .pipe(
            startWith<string | Product>(''),
            map(value => typeof value === 'string' ? value : value.name),
            map(name => name ? this.filterProduct(name) : this.productList.slice())
        );
    }

    // private onSuccessRespCdInternal(data, headers) {
    //     this.respCodeInternalList = data.content;
    //     console.log('this.respCodeInternalList : ', this.respCodeInternalList);
    // }

    private onError(error) {
        console.log('error..');
    }

    public onPaginateChange($event): void {
        this.curPage = $event.pageIndex + 1;
        // this.loadAll(this.curPage);
        this.filterData('');
    }

    public async exportCSV(reportType): Promise<void> {
        this.filter.filDateFStart = (this.dateFStartCtrl.value === null ? null : this.dateFStartCtrl.value);
        this.filter.filDateTStart = (this.dateTStartCtrl.value === null ? null : this.dateTStartCtrl.value);

        const blob = await this.transListService.exportCSV({filter: this.filter }).then(
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
    filDateFStart: any;
    filDateTStart: any;
    requestorId?: any;
    responderId?: any;
    transTypeCode?: string;
    productId?: number;
    rcInternal?: string;
    mode?: number;
}

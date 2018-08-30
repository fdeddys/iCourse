import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { PromotionTrans } from './promotion-trans.model';
import { PromotionTransService } from './promotion-trans.service';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { FormControl } from '@angular/forms';
import { TransType } from '../transaction-type/transaction-type.model';
import { TransTypeService } from '../transaction-type/transaction-type.service';
import { Promotion } from '../promotion/promotion.model';
import { PromotionService } from '../promotion/promotion.service';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatPaginator } from '@angular/material';
import { GRID_THEME, CSS_BUTTON, NO_DATA_GRID_MESSAGE, TOTAL_RECORD_PER_PAGE, REPORT_PATH } from '../../shared/constant/base-constant';
import { MatActionButtonComponent } from '../../shared/templates/mat-action-button.component';

import { PromotionTransDialogComponent } from './promotion-trans-dialog.component';

@Component({
    selector: 'app-promotion-trans',
    templateUrl: './promotion-trans.component.html',
    styleUrls: ['./promotion-trans.component.css']
})

export class PromotionTransComponent implements OnInit {
    @ViewChild('downloadLink') private downloadLink: ElementRef;

    private gridApi;
    private gridColumnApi;
    promotionTranses: PromotionTrans[];
    promotionTrans: PromotionTrans;
    transTypeList: TransType[];
    promotionList: Promotion[];

    cssButton = CSS_BUTTON;
    theme: String = GRID_THEME;
    filter: PromotionTransFilter = {
        transTypeId: null,
        promotionId: null,
        rrn: null,
        startTransDate: null,
        endTransDate: null,
    };
    messageNoData: string = NO_DATA_GRID_MESSAGE;
    curPage = 1;
    totalData = 0;
    totalRecord = TOTAL_RECORD_PER_PAGE;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    dateFStartCtrl: FormControl;
    dateTStartCtrl: FormControl;
    promotionCtrl: FormControl;
    filteredPromotion: Observable<any[]>;

    gridOptions = {
        columnDefs: [
            { headerName: 'No', field: 'no', width: 100, minWidth: 100, maxWidth: 100, pinned: 'left', editable: false },
            { headerName: 'Transaction Type', field: 'transType.name', width: 250, pinned: 'left', editable: false },
            { headerName: 'Promotion', field: 'promotion.name', width: 300, editable: false },
            { headerName: 'RRN', field: 'rrn', width: 150 },
            { headerName: 'Debit', field: 'debit', width: 150, valueFormatter: this.valFormatter },
            { headerName: 'Credit', field: 'credit', width: 150, valueFormatter: this.valFormatter },
            // { headerName: 'Balance', field: 'balance', width: 150 },
            { headerName: 'Transaction Date', field: 'transDate', width: 185, editable: false,
            valueFormatter: this.dateFormatterId },
            // { headerName: ' ', width: 80, minWidth: 80, maxWidth: 150, cellRenderer: 'actionRenderer'}
        ],
        rowData: [],
        enableSorting: true,
        enableFilter: true,
        // rowSelection: "multiple"
        pagination: true,
        enableColResize: true,
        paginationPageSize: 10,
        suppressPaginationPanel : true,
        localeText: {noRowsToShow: this.messageNoData},
        frameworkComponents: {
            // checkboxRenderer: MatCheckboxComponent,
            actionRenderer: MatActionButtonComponent
        }
    };

    dateFormatterId(params): string {
        return new Date(params.value).toLocaleDateString('id');
    }

    valFormatter(params): string {
        const temp = (parseFloat(params.value)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&.');
        return temp.substring(0, (temp.length - 3));
    }

    constructor(
        translate: TranslateService,
        private transTypeService: TransTypeService,
        private promotionService: PromotionService,
        private promotionTransService: PromotionTransService,
        private dialog: MatDialog,
    ) {
        translate.setDefaultLang('en');
        translate.use('en');

        this.dateFStartCtrl = new FormControl();
        this.dateTStartCtrl = new FormControl();
        this.promotionCtrl = new FormControl();
    }

    ngOnInit() {
        this.transTypeService.filter({
            page: 1,
            count: 10000,
            filter: {
                'name': 'Manual Promotion Budget'
            },
        }, false)
        .subscribe(
            (res: HttpResponse<TransType[]>) => this.onSuccessTransType(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { console.log('finally'); }
        );

        this.promotionService.budgetRequired({
            'isBudgetRequired': 1,
            'isActive': 1
        })
        .subscribe(
            (res: HttpResponse<Promotion[]>) => this.onSuccessPromotion(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { console.log('finally'); }
        );

        this.transTypeList = [];
    }

    filterPromotion(name: string) {
        return this.promotionList.filter(promotion =>
        promotion.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
    }

    displayFnProm(promotion?: Promotion): string | undefined {
        return promotion ? promotion.name : undefined;
    }

    dateFormatter(params): string {
        const dt  = new Date(params);
        const year = dt.getFullYear();
        const mth = dt.getMonth() + 1;
        const day = dt.getDate();
        // return dt.toLocaleString(['id']);
        return year + '-' + (mth < 10 ? '0' + mth : mth) + '-' + (day < 10 ? '0' + day : day);
    }

    actionfilter(): void {
        this.paginator._pageIndex = 0;
        this.filterData(1);
    }

    filterData(page): void {
        if (page !== '') {
            this.curPage = page;
        }
        this.filter.promotionId = (this.promotionCtrl.value === null ? null : this.promotionCtrl.value.id);
        this.filter.startTransDate = (this.dateFStartCtrl.value === null ? null : this.dateFormatter(this.dateFStartCtrl.value));
        this.filter.endTransDate = (this.dateTStartCtrl.value === null ? null : this.dateFormatter(this.dateTStartCtrl.value));

        if (this.filter.startTransDate !== null && this.filter.endTransDate !== null) {
            this.filter.startTransDate = this.filter.startTransDate + ' 00:00';
            this.filter.endTransDate = this.filter.endTransDate + ' 23:59';
        }
        if (this.transTypeList.length === 1) {
            this.filter.transTypeId = this.transTypeList[0].id;
        }
        console.log(this.filter);

        this.promotionTransService.filter({
            page: this.curPage,
            count: this.totalRecord,
            filter: this.filter,
        })
        .subscribe(
            (res: HttpResponse<PromotionTrans[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { console.log('finally'); }
        );
    }

    private onSuccess(data, headers) {
        this.promotionTranses = data.content;
        for (let index = 0; index < this.promotionTranses.length; index++) {
            this.promotionTranses[index].no = index + data.pageable.offset + 1;
        }
        this.gridApi.setRowData(this.promotionTranses);
        this.totalData = data.totalElements;
    }

    private onSuccessTransType(data, headers) {
        console.log('isi response trans type ==> ', data);
        this.transTypeList = data.content;
    }

    private onSuccessPromotion(data, headers) {
        this.promotionList = data;
        this.filteredPromotion = this.promotionCtrl.valueChanges
        .pipe(
            startWith<string | Promotion>(''),
            map(value => typeof value === 'string' ? value : value.name),
            map(name => name ? this.filterPromotion(name) : this.promotionList.slice())
        );
    }

    private onError(error) {
        console.log('error..');
    }

    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        this.gridApi.sizeColumnsToFit();

        window.onload = () => {
            console.log('resize..');
            this.gridApi.sizeColumnsToFit();
        };

        window.onresize = () => {
            console.log('resize..');
            this.gridApi.sizeColumnsToFit();
        };

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
            transTypeData : this.transTypeList,
            promotionData : this.promotionList,
            rowData : {
                transType: null,
                promotionId: null,
                rrn: null,
                transDate: null,
                debit: null,
                credit: null,
                balance: null,
            },
        };
        if (mode !== 'create') {
            datasend.mode = mode;
            datasend.modeTitle = (mode === 'view' ? 'View' : 'Edit');
            datasend.rowData = data;
        }
        const dialogRef = this.dialog.open(PromotionTransDialogComponent, {
            width: '1000px',
            // height: '700px',
            data: datasend
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            this.filterData('');
        });
    }

    public async exportCSV(reportType): Promise<void> {
        const blob = await this.promotionTransService.exportCSV(reportType, this.filter).then(
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
        this.filterData('');
    }
}

export interface PromotionTransFilter  {
    transTypeId?: number;
    promotionId?: number;
    rrn?: string;
    startTransDate?: any;
    endTransDate?: any;
}

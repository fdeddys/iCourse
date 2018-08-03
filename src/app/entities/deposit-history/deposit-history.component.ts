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
import { BillerService, Biller } from '../biller';
import { Member } from '../member';

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
    dateFStartCtrl: FormControl;
    dateTStartCtrl: FormControl;
    depositHistories: DepositHistory[];
    billerList = [];
    billerSelected;
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
        description: null
    };

    allBiller: Biller = {
        id: 0,
        memberCode: 'ALL',
        dateStart: null,
        dateThru: null,
        member:  {
            id : 0,
            name: 'ALL',
            description: 'ALL',
        }
    };
    filChkBox = {
        start: false,
        through: false
    };

    gridOptions = {
        columnDefs: [
            // { headerName: 'Name', field: 'name', checkboxSelection: true, width: 250, pinned: 'left', editable: true },
            { headerName: 'No', field: 'no', width: 50, pinned: 'left', editable: false },
            { headerName: 'Tx Date', field: 'transDate', width: 125, editable: false,  valueFormatter: this.dateFormatter2  },
            { headerName: 'Type', field: 'transTypeDesc', width: 150, editable: false },
            { headerName: 'Member', field: 'memberName', width: 150, editable: false },
            { headerName: 'Desc', field: 'description', width: 200, editable: false },
            { headerName: 'Debit', field: 'debit', width: 125,  editable: false },
            { headerName: 'Credit', field: 'credit', width: 125,  editable: false },
            { headerName: 'Balance', field: 'balance', width: 125, editable: false },
            // { headerName: ' ', width: 80, cellRenderer: 'actionRenderer', pinned: 'left', editable: false}
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
        private billerService: BillerService,
        private depositHistoryService: DepositHistoryService,
        private dialog: MatDialog,
        private route: ActivatedRoute,
    ) {
        translate.use('en');
        this.dateFStartCtrl = new FormControl();
        this.dateTStartCtrl = new FormControl();
    }

    ngOnInit() {
        console.log('this.route : ', this.route);
        this.findBiller();
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
        // console.log('isi param ', params.value);
        const dt  = new Date(params);
        const year = dt.getFullYear();
        const mth = dt.getMonth() + 1;
        const day = dt.getDate();
        // return dt.toLocaleString(['id']);
        return year + '-' + (mth < 10 ? '0' + mth : mth) + '-' + (day < 10 ? '0' + day : day);
    }

    dateFormatter2(params): string {
        // console.log('isi param ', params.value);
        const dt  = new Date(params.value);
        const year = dt.getFullYear();
        const mth = dt.getMonth() + 1;
        const day = dt.getDate();
        // return dt.toLocaleString(['id']);
        return year + '-' + (mth < 10 ? '0' + mth : mth) + '-' + (day < 10 ? '0' + day : day);
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

        let allData = false;
        if (  this.filter.memberTypeId === 0 ) {
            delete this.filter.memberTypeId;
            allData = true;
        }

        if (page !== '') {
            this.curPage = page;
        }
        this.filter.filDateFStart = (this.dateFStartCtrl.value === null ? null : this.dateFormatter(this.dateFStartCtrl.value));
        this.filter.filDateTStart = (this.dateTStartCtrl.value === null ? null : this.dateFormatter(this.dateTStartCtrl.value));
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
        if ( allData ) {
            this.filter.memberTypeId = this.allBiller.id;
        }
    }

    private findBiller() {

        this.billerService.findIsDeposit()
        .subscribe(
                (res: HttpResponse<Biller[]>) => this.onSuccessBiller(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { console.log('finally'); }
        );

    }

    private onSuccessBiller(data, headers) {
        console.log('data.content member type : ', data);
        this.billerList = data;
        this.billerList.push(this.allBiller);
        this.filter.memberTypeId = this.allBiller.id;
        // this.billerSelected = this.allBiller;
    }

    private onSuccess(data, headers) {
        console.log('success..', data);
        if (data === null ) {
            this.totalData = 0;
            this.depositHistories = [];
        } else {
            this.depositHistories = data.content;
            for (let index = 0; index < this.depositHistories.length; index++) {
                this.depositHistories[index].no = index + 1;
            }
            this.totalData = data.totalElements;
        }
        this.gridApi.setRowData(this.depositHistories);
    }

    private onError(error) {
        console.log('error..');
    }


    public async exportCSV(reportType): Promise<void> {

        const blob = await this.depositHistoryService.exportCSV({filter: this.filter }).then(
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
}

export interface DepositHistoryFilter {
    memberTypeId?: number;
    transTypeId?: number;
    amount?: number;
    filDateFStart?: string;
    filDateTStart?: string;
    description?: string;
}

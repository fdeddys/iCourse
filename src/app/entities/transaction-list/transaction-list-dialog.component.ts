import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { TransList } from './transaction-list.model';
import { TransListService } from './transaction-list.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// import { CommonValidatorDirective } from '../../validators/common.validator';
import { SNACKBAR_DURATION_IN_MILLISECOND, NO_DATA_GRID_MESSAGE, GRID_THEME } from '../../shared/constant/base-constant';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-transaction-list-dialog',
    templateUrl: './transaction-list-dialog.component.html',
    styleUrls: ['./transaction-list-dialog.component.css']
})

export class TransListDialogComponent implements OnInit {
    TOTAL_RECORD_GRID_DETIL = 4;
    transList: TransList;
    transGridDetils: TransList[];
    respCodeInternalList: any[];
    transListForm: FormGroup;
    submitted = false;
    rcIntDisabled = true;
    modeTitle: any;
    duration = SNACKBAR_DURATION_IN_MILLISECOND;
    fromTable: String;
    messageNoData: string = NO_DATA_GRID_MESSAGE;
    curPage = 1;
    totalData = 0;
    gridApi;
    gridColumnApi;
    theme: String = GRID_THEME;
    constructor(
        translate: TranslateService,
        public snackBar: MatSnackBar,
        public transTypeService: TransListService,
        private transListService: TransListService,
        public dialogRef: MatDialogRef<TransListDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        translate.use('en');
    }

    gridOptions = {
        columnDefs: [
            { headerName: 'No', field: 'no', width: 70, minWidth: 70, maxWidth: 70, pinned: 'left', editable: false },
            { headerName: 'Transaction Date', field: 'transmissionDateTime', width: 200, pinned: 'left', editable: false },
            { headerName: 'Type', field: 'transType.code', width: 120 },
            { headerName: 'Desc', field: 'transType.name', width: 250 },
            { headerName: 'Updated', field: 'updatedAt', width: 200 },
        ],
        rowData: this.transGridDetils,
        enableSorting: true,
        enableFilter: true,
        enableColResize: true,
        // rowSelection: "multiple"
        pagination: true,
        paginationPageSize: 10,
        suppressPaginationPanel : true,
        localeText: {noRowsToShow: this.messageNoData},
    };

    ngOnInit() {
        // this.transListForm = this.formBuilder.group({
        //     name: ['', [CommonValidatorDirective.required]],
        // });

        this.transList = {};
        if (this.data.mode !== 'create') {
            // search
            console.log('this.data.mode : ', this.data.mode);
            this.transList = this.data.rowData;
            this.respCodeInternalList = [
                {responseCode: '00', description: 'Approved'},
                {responseCode: '25', description: 'Pending'},
                {responseCode: '36', description: 'Failed'}
            ];
            if (this.data.mode === 'edit') {
                this.rcIntDisabled = false;
            }
            switch (this.transList.sellPriceFromTable) {
                case 1: this.fromTable = 'Biller ';
                    break;
                case 2: this.fromTable = 'Price Detail ';
                    break;
                case 3: this.fromTable = 'Promotion';
                    break;
            }
        }
    }

    onGridReady(params) {
        console.log('grid detil on ready');
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        console.log('grid detil on ready finish');
        // console.log(this.gridApi);
        // console.log(this.gridColumnApi);
        // params.api.sizeColumnsToFit();
        // this.loadAll(this.curPage);
        this.filterData('');
    }

    filterData(page): void {
        if (page !== '') {
            this.curPage = page;
        }
        this.transListService.filter({
            page: this.curPage,
            count: this.TOTAL_RECORD_GRID_DETIL,
            filter: {
                rrnRequestor: this.transList.rrnRequestor
            },
        })
        .subscribe(
            (res: HttpResponse<TransList[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { console.log('finally'); }
        );
    }

    private onSuccess(data, headers) {
        console.log('isi response product ==> ', data.content);
        this.transGridDetils = data.content;
        if  ( this.transGridDetils.length > 0 ) {
            this.fillNumber(this.transGridDetils);
        }
        this.gridApi.setRowData(data.content);
        console.log('isi response product ==> FINISH ');
    }

    private onError(error) {
        this.transGridDetils = [];
        console.log('error..');
    }

    public onPaginateChange($event): void {
        this.curPage = $event.pageIndex + 1;
        // this.loadAll(this.curPage);
        this.filterData('');
    }

    private fillNumber(transList: TransList[]) {
        let i = 1;
        for (const transL of transList) {
            transL.no = i++;
        }
    }

    onSubmit(): void {
        console.log('send to service ', this.transList);
        // this.transListService.update(this.transList.id, this.transList).subscribe((res: HttpResponse<TransList>) => {
        //     if (res.body.errMsg === null || res.body.errMsg === '') {
        //         this.dialogRef.close('refresh');
        //     } else {
        //         this.snackBar.open('Error !' + res.body.errMsg , 'Close', {
        //             duration: this.duration,
        //         });
        //     }
        // });
    }

}

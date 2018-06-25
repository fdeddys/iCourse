import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';

import { NO_DATA_GRID_MESSAGE } from '../../shared/constant/base-constant';

@Component({
    selector: 'app-biller-price-info-biller',
    templateUrl: './biller-price-info-biller.component.html',
    styleUrls: ['./biller-price-info-biller.component.css'],
})
export class BillerPriceInfoBillerComponent implements OnInit {

    private gridApi;
    private gridColumnApi;
    messageNoData: string = NO_DATA_GRID_MESSAGE;

    gridOptions = {
        columnDefs: [
            // { headerName: 'Name', field: 'name', checkboxSelection: true, width: 250, pinned: 'left', editable: true },
            { headerName: 'No', field: 'no', width: 100, pinned: 'left', editable: false },
            { headerName: 'Name', field: 'description', width: 300, pinned: 'left', editable: false },
            { headerName: 'Date Start', field: 'dateStart', width: 300 },
            { headerName: 'Date Thru', field: 'dateThru', width: 350 }
        ],
        enableSorting: true,
        enableFilter: true,
        // rowSelection: "multiple"
        pagination: true,
        paginationPageSize: 10,
        localeText: {noRowsToShow: this.messageNoData},
    };

    constructor(
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<BillerPriceInfoBillerComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngOnInit() {

    }

    onGridReady(params) {
        console.log('onGridReady..');
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;

        this.gridApi.setRowData(this.data);
    }
}
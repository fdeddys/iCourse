import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';

import { GRID_THEME, NO_DATA_GRID_MESSAGE } from '../../shared/constant/base-constant';

@Component({
    selector: 'app-biller-price-info-biller',
    templateUrl: './biller-price-info-biller.component.html',
    styleUrls: ['./biller-price-info-biller.component.css'],
})
export class BillerPriceInfoBillerComponent implements OnInit {

    private gridApi;
    private gridColumnApi;
    messageNoData: string = NO_DATA_GRID_MESSAGE;
    theme: String = GRID_THEME;

    gridOptions = {
        columnDefs: [
            // { headerName: 'Name', field: 'name', checkboxSelection: true, width: 250, pinned: 'left', editable: true },
            { headerName: 'No', field: 'no', width: 70, pinned: 'left', editable: false },
            { headerName: 'Name', field: 'billerHeader.member.name', width: 180, pinned: 'left', editable: false },
            { headerName: 'Description', field: 'billerHeader.description', width: 200, pinned: 'left', editable: false },
            { headerName: 'Buy Price', field: 'buyPrice', width: 80, valueFormatter: this.currencyFormatter },
            { headerName: 'Fee', field: 'fee', width: 80, valueFormatter: this.currencyFormatter },
            { headerName: 'Sell Price', field: 'sellPrice', width: 100, valueFormatter: this.currencyFormatter },
        ],
        enableSorting: true,
        enableFilter: true,
        // rowSelection: "multiple"
        enableColResize: true,
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

    currencyFormatter(params) {
        const val = params.value;
        if (val !== null) {
            const temp = (parseFloat(val)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&.');
            return temp.substring(0, (temp.length - 3));
        }
    }

    onGridReady(params) {
        console.log('onGridReady..');
        console.log(this.data);
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;

        this.gridApi.setRowData(this.data);
    }
}

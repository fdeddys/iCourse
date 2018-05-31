import { Component, OnInit, Inject } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Product } from './product.model';
import { ProductService } from './product.service';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ProductDialogComponent } from './product-dialog.component';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

    // displayedColumns = ['name', 'denom', 'sales_price', 'status'];
    // dataSource = ELEMENT_DATA;

    private gridApi;
    private gridColumnApi;
    products: Product[];
    product: Product;
    gridOptions = {
        columnDefs: [
            // { headerName: 'Name', field: 'name', checkboxSelection: true, width: 250, pinned: 'left', editable: true },
            { headerName: 'Name', field: 'name', width: 250, pinned: 'left', editable: false },
            { headerName: 'Denom', field: 'denom', width: 250, editable: false },
            { headerName: 'Sell Price', field: 'sellPrice', width: 250 },
            { headerName: 'Status', field: 'status', width: 250 },
            { headerName: 'Search By', field: 'searchBy', width: 250 },
            { headerName: 'Search By Biller', field: 'searchByMemberId', width: 250 },
            { headerName: 'Action', suppressMenu: true,
                suppressSorting: true,
                template: `
                <button mat-button color="primary" data-action-type="view">
                    View
                </button>

                <button mat-button color="primary" data-action-type="edit">
                    Edit
                </button>
                `
            }
        ],
        rowData: this.products,
        enableSorting: true,
        enableFilter: true,
        // rowSelection: "multiple"
        pagination: true,
        paginationPageSize: 10
    };

    constructor(
        private dialog: MatDialog,
        private productService: ProductService
    ) { }

    loadAll() {
        console.log('Start call function all header');
        this.productService.query({
            page: 1,
            count: 20,
            // size: this.itemsPerPage,
            // sort: this.sort()
        })
        .subscribe(
                (res: HttpResponse<Product[]>) => this.onSuccess(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { console.log('finally'); }
        );
    }

    load(id) {
        this.productService.find(id)
            .subscribe((productResponse: HttpResponse<Product>) => {
                this.product = productResponse.body;
            });
    }

    ngOnInit() {
        // this.loadAll();
        // this.load(1);
    }

    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;

        // console.log(this.gridApi);
        // console.log(this.gridColumnApi);

        this.loadAll();
    }

    onRowClicked(e) {
        if (e.event.target !== undefined) {
            const data = e.data;
            const actionType = e.event.target.getAttribute('data-action-type');

            switch (actionType) {
                case 'view':
                    data.mode = 'view';
                    console.log('Data row : ', data);
                    return this.openDialog('view', data);
                case 'edit':
                    data.mode = 'edit';
                    console.log('Data row : ', data);
                    return this.openDialog('edit', data);
            }
        }
    }

    openDialog(mode, data): void {
        const newData = {
            mode : 'create',
            denom : null,
            id : null,
            name : null,
            productCode : null,
            searchBy : null,
            searchByMemberId : null,
            sellPrice : null,
            status : null
        };
        const dialogRef = this.dialog.open(ProductDialogComponent, {
            width: '1000px',
            data: (mode === 'create' ? newData : data)
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            // this.animal = result;
        });
    }

    private onSuccess(data, headers) {
        console.log('success..', data);
        this.products = data.content;
        this.gridApi.setRowData(this.products);
    }

    private onError(error) {
        console.log('error..');
    }

}

// billerCompany : {id: 1, name: "Telkomsel"}
// billerType : {id: 1, ispostpaid: false, name: "Pulsa Handphone"}
// denom : "5000"
// id : 1
// name : "Pulsa HP"
// productCode : "PLSTSEL5"
// searchBy : 1
// searchByMemberId : 10
// sellPrice : 8000
// status : "ACTIVE"


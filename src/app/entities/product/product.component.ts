import { Component, OnInit, Inject } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Product } from './product.model';
import { ProductService } from './product.service';

import { BillerCompany, BillerCompanyService } from '../biller-company';
import { BillerType, BillerTypeService } from '../biller-type';
import { Member, MemberService } from '../member';

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
    billerTypeList = [];
    billerCompanyList = [];
    memberList = [];
    searchByList = [];

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
        private billerCompanyService: BillerCompanyService,
        private billerTypeService: BillerTypeService,
        private memberService: MemberService,
        private productService: ProductService
    ) { }

    loadAll() {
        console.log('Start call function all header');
        this.productService.query({
            page: 1,
            count: 200,
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

        this.billerCompanyService.query({})
        .subscribe(
                // (res: HttpResponse<BillerCompany[]>) => this.onSuccess(res.body, res.headers),
                (res: HttpResponse<BillerCompany[]>) => {
                    this.billerCompanyList = res.body;
                },
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { console.log('finally'); }
        );
        this.billerTypeService.query({
            page: 1,
            count: 10000,
        })
        .subscribe(
                (res: HttpResponse<BillerType[]>) => this.onSuccessBillType(res.body, res.headers),
                // (res: HttpResponse<BillerType[]>) => {
                //     console.log(res.body);
                //     this.billerTypeList = res.body;
                // },
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

        this.productService.getSearchBy()
        .subscribe(
                (res) => {
                    this.searchByList = res.body;
                },
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { console.log('finally'); }
        );
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
            modeTitle : 'Create',
            billerCompanyData : this.billerCompanyList,
            billerTypeData : this.billerTypeList,
            searchByData : this.searchByList,
            memberData : this.memberList,
            rowData : {
                billerCompany : {id: null, name: null},
                billerType : {id: null, ispostpaid: null, name: null},
                denom : null,
                name : null,
                productCode : null,
                searchBy : null,
                searchByMemberId : null,
                sellPrice : null,
                status : null
            },
        };
        if (mode !== 'create') {
            datasend.mode = mode;
            datasend.modeTitle = (mode === 'view' ? 'View' : 'Edit');
            datasend.rowData = data;
        }
        const dialogRef = this.dialog.open(ProductDialogComponent, {
            width: '1000px',
            height: '450px',
            data: datasend
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            // this.animal = result;
            this.loadAll();
        });
    }

    private onSuccessBillType(data, headers) {
        this.billerTypeList = data.content;
    }

    private onSuccessMemb(data, headers) {
        this.memberList = data.content;
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


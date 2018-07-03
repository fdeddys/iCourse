import { Component, OnInit, Inject } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Product } from './product.model';
import { ProductService } from './product.service';

import { BillerCompany, BillerCompanyService } from '../biller-company';
import { BillerType, BillerTypeService } from '../biller-type';
import { Member, MemberService } from '../member';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GRID_THEME, CSS_BUTTON, NO_DATA_GRID_MESSAGE , REPORT_PATH } from '../../shared/constant/base-constant';
import { MatActionButtonComponent } from '../../shared/templates/mat-action-button.component';

import { ProductDialogComponent } from './product-dialog.component';

import { MainChild, eventSubscriber } from '../../layouts/main/main-child.interface';
import { MainService } from '../../layouts/main/main.service';

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
    statusList = [];
    theme: String = GRID_THEME;
    cssButton = CSS_BUTTON  ;
    messageNoData: string = NO_DATA_GRID_MESSAGE;
    private resourceUrl = REPORT_PATH;

    gridOptions = {
        columnDefs: [
            // { headerName: 'Name', field: 'name', checkboxSelection: true, width: 250, pinned: 'left', editable: true },
            { headerName: 'No', field: 'no', width: 100, minWidth: 100, maxWidth: 100, pinned: 'left', editable: false },
            { headerName: 'Name', field: 'name', width: 250, pinned: 'left', editable: false },
            { headerName: 'Product Code', field: 'productCode', width: 200, editable: false },
            { headerName: 'Denom', field: 'denom', width: 150, cellStyle: {textAlign: 'right'}, editable: false },
            { headerName: 'Sell Price', field: 'sellPrice', width: 150, cellStyle: {textAlign: 'right'} },
            { headerName: 'Status', field: 'status', width: 200 },
            // { headerName: 'Search By', field: 'searchBy', width: 250 },
            // { headerName: 'Search By Biller', field: 'searchByMemberId', width: 250 },
            { headerName: ' ', width: 150, minWidth: 150, maxWidth: 150, cellRenderer: 'actionRenderer'}
            // { headerName: ' ', suppressMenu: true,
            //     suppressSorting: true,
            //     template: `
            //     <button mat-button color="primary" data-action-type="edit"  ${this.cssButton} >
            //         Edit
            //     </button>
            //     `
            // }
        ],
        rowData: this.products,
        enableSorting: true,
        enableFilter: true,
        // rowSelection: "multiple"
        pagination: true,
        paginationPageSize: 10,
        localeText: {noRowsToShow: this.messageNoData},
        frameworkComponents: {
            // checkboxRenderer: MatCheckboxComponent,
            actionRenderer: MatActionButtonComponent
        }
    };

    constructor(
        private mainService: MainService,
        private dialog: MatDialog,
        private billerCompanyService: BillerCompanyService,
        private billerTypeService: BillerTypeService,
        private memberService: MemberService,
        private productService: ProductService
    ) {
        this.resizeColumn = this.resizeColumn.bind(this);
        eventSubscriber(mainService.subscription, this.resizeColumn);
    }

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

        this.productService.getStatus()
        .subscribe(
                (res) => {
                    this.statusList = res.body;
                },
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { console.log('finally'); }
        );
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
            modeTitle : 'Add',
            billerCompanyData : this.billerCompanyList,
            billerTypeData : this.billerTypeList,
            searchByData : this.searchByList,
            statusData : this.statusList,
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
                status : 'ACTIVE'
            },
        };
        if (mode !== 'create') {
            datasend.mode = mode;
            datasend.modeTitle = (mode === 'view' ? 'View' : 'Edit');
            datasend.rowData = data;
        }
        const dialogRef = this.dialog.open(ProductDialogComponent, {
            width: '1000px',
            height: '500px',
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
        for (let index = 0; index < this.products.length; index++) {
            this.products[index].no = index + 1;
        }
        this.gridApi.setRowData(this.products);
    }

    private onError(error) {
        console.log('error..');
    }

    resizeColumn() {
        setTimeout(() => {
            this.gridApi.sizeColumnsToFit();
        }, 400);
    }

    public exportCSV(reportType): void {
        const path = this.resourceUrl  + 'billProduct';
        window.open(`${path}/${reportType}`);
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


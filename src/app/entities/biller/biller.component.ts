import { Component, OnInit, Inject, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';

import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Biller } from './biller.model';
import { BillerService } from './biller.service';

import { Member, MemberService } from '../member';
import { MemberType, MemberTypeService } from '../member-type';
import { BillerCompany, BillerCompanyService } from '../biller-company';
import { BillerType, BillerTypeService } from '../biller-type';
import { Product, ProductService } from '../product';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { BillerDialogComponent } from './biller-dialog.component';
import { NO_DATA_GRID_MESSAGE } from '../../shared/constant/base-constant';
import { MatActionButtonComponent } from '../../shared/templates/mat-action-button.component';

@Component({
    selector: 'app-biller',
    templateUrl: './biller.component.html',
    styleUrls: ['./biller.component.css']
})
export class BillerComponent implements OnInit {

    // displayedColumns = ['memberName', 'memberType', 'dateStart', 'dateThru', 'status'];
    // dataSource = [];

    private gridApi;
    private gridColumnApi;
    billers: Biller[];
    biller: Biller;

    memberList = [];
    memberTypeList = [];
    billerTypeList = [];
    billerCompanyList = [];
    productList = [];
    statusList = [];
    messageNoData: string = NO_DATA_GRID_MESSAGE;

    menuName = '';

    gridOptions = {
        columnDefs: [
            // { headerName: 'Name', field: 'name', checkboxSelection: true, width: 250, pinned: 'left', editable: true },
            { headerName: 'No', field: 'no', width: 100, pinned: 'left', editable: false },
            { headerName: 'Name', field: 'description', width: 300, pinned: 'left', editable: false },
            { headerName: 'Date Start', field: 'dateStart', width: 300 },
            { headerName: 'Date Thru', field: 'dateThru', width: 350 },
            { headerName: ' ', width: 150, cellRenderer: 'actionRenderer'}
            // { headerName: ' ', suppressMenu: true,
            //     suppressSorting: true,
            //     template: `
            //     <button mat-button color="primary" data-action-type="edit">
            //         Edit
            //     </button>
            //     `
            // },
        ],
        rowData: this.billers,
        enableSorting: true,
        enableFilter: true,
        // rowSelection: "multiple"
        pagination: true,
        paginationPageSize: 10,
        localeText: {noRowsToShow: this.messageNoData},
        frameworkComponents: {
            actionRenderer: MatActionButtonComponent
        }
    };

    constructor(
        private dialog: MatDialog,
        private billerCompanyService: BillerCompanyService,
        private billerTypeService: BillerTypeService,
        private productService: ProductService,
        private memberService: MemberService,
        private memberTypeService: MemberTypeService,
        private billerService: BillerService,
        private route: ActivatedRoute
    ) { }

    loadAll() {
        console.log('Start call function all header');
        this.billerService.query({
            allData: (this.route.snapshot.routeConfig.path === 'non-biller' ? 0 : 1),
            page: 1,
            count: 200,
            // size: this.itemsPerPage,
            // sort: this.sort()
        })
        .subscribe(
                (res: HttpResponse<Biller[]>) => this.onSuccess(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { console.log('finally'); }
        );
    }

    load(id) {
        this.billerService.find(id)
            .subscribe((productResponse: HttpResponse<Biller>) => {
                this.biller = productResponse.body;
            });
    }

    ngOnInit() {
        console.log('this.route : ', this.route);
        if (this.route.snapshot.routeConfig.path === 'non-biller') {
            this.menuName = 'Non-Biller';
        } else if (this.route.snapshot.routeConfig.path === 'biller') {
            this.menuName = 'Biller';
        }

        this.memberService.query({
            page: 1,
            count: 10000,
        })
        .subscribe(
                (res: HttpResponse<Member[]>) => this.onSuccessMemb(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { console.log('finally'); }
        );

        this.memberTypeService.query({
            page: 1,
            count: 10000,
        })
        .subscribe(
                (res: HttpResponse<MemberType[]>) => this.onSuccessMembType(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { console.log('finally'); }
        );

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

        this.productService.query({
            page: 1,
            count: 10000,
            // size: this.itemsPerPage,
            // sort: this.sort()
        })
        .subscribe(
                (res: HttpResponse<Product[]>) => this.onSuccessProduct(res.body, res.headers),
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
            billType : this.route.snapshot.routeConfig.path,
            billerCompanyData : this.billerCompanyList,
            billerTypeData : this.billerTypeList,
            memberData: this.memberList,
            memberTypeData : this.memberTypeList,
            productData : this.productList,
            statusData : this.statusList,
            rowData : {
                description : null,
                dateStart : null,
                dateThru : null,
                searchBy : null,
                // memberId : null,
                // memberTypeId : (this.memberTypeList.length === 1 && this.memberTypeList[0].id === 1 ? 1 : null),
                member : null,
                memberType : (this.memberTypeList.length === 1 && this.memberTypeList[0].id === 1 ? this.memberTypeList[0] : null),
            },
        };
        if (mode !== 'create') {
            datasend.mode = mode;
            datasend.modeTitle = (mode === 'view' ? 'View' : 'Edit');
            datasend.rowData = data;
        }
        const dialogRef = this.dialog.open(BillerDialogComponent, {
            width: '1000px',
            height: '1100px',
            data: datasend
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            // if (result === 'refresh') {
                this.loadAll();
            // }
            // this.animal = result;
        });
    }

    private onSuccessMemb(data, headers) {
        this.memberList = data.content;
    }

    private onSuccessMembType(data, headers) {
        console.log('data.content member type : ', data.content);
        // this.memberTypeList = data.content;
        if (this.route.snapshot.routeConfig.path === 'non-biller') {
            this.memberTypeList = _.filter(data.content, function(o) { return o.id !== 1; });
        } else if (this.route.snapshot.routeConfig.path === 'biller') {
            this.memberTypeList = _.filter(data.content, function(o) { return o.id === 1; });
        }
    }

    private onSuccessBillType(data, headers) {
        this.billerTypeList = data.content;
    }

    private onSuccessProduct(data, headers) {
        this.productList = data.content;
    }

    private onSuccess(data, headers) {
        console.log('success..', data);
        this.billers = data.content;
        for (let index = 0; index < this.billers.length; index++) {
            this.billers[index].no = index + 1;
        }
        this.gridApi.setRowData(this.billers);
    }

    private onError(error) {
        console.log('error..');
    }

}

// export interface BillerElement {
//     public id?: number,
//     public description?: string,
//     public dateStart?: string,
//     public dateThru?: string,
//     public memberTypeId?: number,
//     public memberId?: number,
// }

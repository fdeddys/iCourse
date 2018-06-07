import { Component, OnInit, Inject } from '@angular/core';
import * as _ from 'lodash';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Biller } from './biller.model';
import { BillerService } from './biller.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Member } from '../member';
import { MemberType } from '../member-type';

import { BillerDetail, BillerDetailService, BillerDetailComponent } from '../biller-detail';
import { BillerPriceDetail, BillerPriceDetailService, BillerPriceDetailComponent } from '../biller-price-detail';
import { MatCheckboxComponent } from '../../shared/templates/mat-checkbox.component';
import { MatActionButtonComponent } from '../../shared/templates/mat-action-button.component';

@Component({
    selector: 'app-biller-dialog',
    templateUrl: './biller-dialog.component.html',
    styleUrls: ['./biller-dialog.component.css']
})
export class BillerDialogComponent implements OnInit {

    private gridApi;
    private gridColumnApi;

    membTypeCtrl: FormControl;
    filteredMembType: Observable<any[]>;
    membCtrl: FormControl;
    filteredMemb: Observable<any[]>;
    dateSCtrl: FormControl;
    dateTCtrl: FormControl;

    biller: Biller;
    billerSave: Biller;

    billerDetail: BillerDetail;
    billerDetails: BillerDetail[];
    memberList = [];
    memberTypeList = [];
    billerTypeList = [];
    billerCompanyList = [];
    productList = [];

    modeTitle = '';

    minDate = new Date(2000, 0, 1);
    maxDate = new Date(2020, 0, 1);

    // checked = false;
    btnDisabled = true;
    btnLabel = 'Add Biller Detail';

    colDefs = [
        // { headerName: 'Name', field: 'name', checkboxSelection: true, width: 250, pinned: 'left', editable: true },
        { headerName: 'External Code', field: 'externalCode', width: 150, pinned: 'left', editable: false },
        { headerName: 'Buy Price', field: 'buyPrice', width: 125 },
        { headerName: 'Fee', field: 'fee', width: 125 },
        { headerName: 'Profit', field: 'profit', width: 125 },
        { headerName: 'Sell Price', field: 'sellPrice', width: 125 },
        { headerName: 'Post Paid', field: 'postPaid', width: 125 },
        // { headerName: 'Status', field: 'status', width: 150, cellRenderer: 'checkboxRenderer'},
        { headerName: 'Status', field: 'status', width: 125},
        // { headerName: 'Action', width: 150, cellRenderer: 'actionRenderer'}
        { headerName: 'Action', suppressMenu: true,
            suppressSorting: true,
            template: `
            <button mat-button color="primary" data-action-type="edit">
                Edit
            </button>
            `
        }
    ];

    nonColDefs = [
        // { headerName: 'Name', field: 'name', checkboxSelection: true, width: 250, pinned: 'left', editable: true },
        { headerName: 'Sales Price', field: 'salesPrice', width: 150 },
        { headerName: 'Profit', field: 'profit', width: 150 },
        { headerName: 'Date Start', field: 'dateStart', width: 150 },
        { headerName: 'Date Thru', field: 'dateThru', width: 150 },
        { headerName: 'Status', field: 'status', width: 150},
        // { headerName: 'Action', width: 150, cellRenderer: 'actionRenderer'}
        { headerName: 'Action', suppressMenu: true,
            suppressSorting: true,
            template: `
            <button mat-button color="primary" data-action-type="edit">
                Edit
            </button>
            `
        }
    ];

    gridOptions = {
        columnDefs: this.colDefs,
        rowData: [],
        enableSorting: true,
        enableFilter: true,
        // rowSelection: "multiple"
        pagination: true,
        paginationPageSize: 10,
        // rowHeight : 41,
        // frameworkComponents: {
        //     checkboxRenderer: MatCheckboxComponent,
        //     actionRenderer: MatActionButtonComponent
        // }
    };

    constructor(
        private dialog: MatDialog,
        public billerService: BillerService,
        public billerDetailService: BillerDetailService,
        public billerPriceDetailService: BillerPriceDetailService,
        public dialogRef: MatDialogRef<BillerDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.membTypeCtrl = new FormControl();
        this.filteredMembType = this.membTypeCtrl.valueChanges
        .pipe(
            startWith<string | MemberType>(''),
            map(value => typeof value === 'string' ? value : value.name),
            map(name => name ? this.filterMembType(name) : this.memberTypeList.slice())
        );

        this.membCtrl = new FormControl();
        this.filteredMemb = this.membCtrl.valueChanges
        .pipe(
            startWith<string | Member>(''),
            map(value => typeof value === 'string' ? value : value.name),
            map(name => name ? this.filterMemb(name) : this.memberList.slice())
        );

        this.dateSCtrl = new FormControl();
        this.dateTCtrl = new FormControl();
    }

    filterMembType(name: string) {
        return this.memberTypeList.filter(memberType =>
        memberType.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
    }

    filterMemb(name: string) {
        return this.memberList.filter(member =>
        member.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
    }

    displayFnMem(member?: Member): string | undefined {
        return member ? member.name : undefined;
    }

    displayFnMemType(memberType?: MemberType): string | undefined {
        return memberType ? memberType.name : undefined;
    }

    ngOnInit() {
        console.log('ngOnInit..');
        this.biller = {};
        this.modeTitle = this.data.modeTitle;
        if (this.data.mode !== 'create') {
            // console.log('edit mode..');
            this.btnDisabled = false;
            this.membTypeCtrl.setValue(this.data.rowData.memberType);
            this.membCtrl.setValue(this.data.rowData.member);
            this.dateSCtrl.setValue(this.data.rowData.dateStart);
            this.dateTCtrl.setValue(this.data.rowData.dateThru);

            // this.addEvent('start', this.data.rowData.dateStart);
            // this.addEvent('thru', this.data.rowData.dateThru);
            // const dataDate = new Date(this.data.rowData.dateStart);
        }
        this.biller = this.data.rowData;
        this.memberList = this.data.memberData;
        this.memberTypeList = this.data.memberTypeData;
        this.billerCompanyList = this.data.billerCompanyData;
        this.billerTypeList = this.data.billerTypeData;
        this.productList = this.data.productData;
    }

    private onSuccess(data, headers) {
        console.log('data detail : ', data.content);
        this.gridApi.setRowData(data.content);
    }

    private onError(error) {
        console.log('error..', error);
    }

    onNoClick(): void {
        console.log('test refresh..');
        this.dialogRef.close('refresh');
    }

    onGridReady(params) {
        console.log('onGridReady..');
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;

        this.loadAll();
    }

    getMembType(value) {
        console.log(value);
        // this.btnDisabled = false;
        this.btnLabel = value.id === 1 ? 'Add Biller Detail' : 'Add Non Biller Detail';
        if (value.id === 1) {
            this.btnLabel = 'Add Biller Detail';
            this.gridApi.setColumnDefs(this.colDefs);
        } else {
            this.btnLabel = 'Add Non Biller Detail';
            this.gridApi.setColumnDefs(this.nonColDefs);
        }
        this.gridApi.setRowData([]);
    }

    loadAll() {
        if (this.data.mode !== 'create') {
            console.log('load data update..');
            if (this.data.rowData.memberType.id === 1) {
                this.getMembType({id: 1});
                this.billerDetailService.query({
                    page: 1,
                    count: 200,
                    idhdr: this.biller.id
                    // size: this.itemsPerPage,
                    // sort: this.sort()
                })
                .subscribe(
                        (res: HttpResponse<Biller[]>) => this.onSuccess(res.body, res.headers),
                        (res: HttpErrorResponse) => this.onError(res.message),
                        () => { console.log('finally'); }
                );
            } else {
                this.getMembType({id: 2});
                this.billerPriceDetailService.query({
                    page: 1,
                    count: 200,
                    idhdr: this.biller.id
                    // size: this.itemsPerPage,
                    // sort: this.sort()
                })
                .subscribe(
                        (res: HttpResponse<Biller[]>) => this.onSuccess(res.body, res.headers),
                        (res: HttpErrorResponse) => this.onError(res.message),
                        () => { console.log('finally'); }
                );
            }
        } else {
            console.log('load data create..');
            if (this.membTypeCtrl.value !== null) {
                if (this.membTypeCtrl.value.id === 1) {
                    // this.getMembType({id: 1});
                    this.billerDetailService.query({
                        page: 1,
                        count: 200,
                        idhdr: this.biller.id
                        // size: this.itemsPerPage,
                        // sort: this.sort()
                    })
                    .subscribe(
                            (res: HttpResponse<Biller[]>) => this.onSuccess(res.body, res.headers),
                            (res: HttpErrorResponse) => this.onError(res.message),
                            () => { console.log('finally'); }
                    );
                } else if (this.membTypeCtrl.value.id > 1) {
                    // this.getMembType({id: 2});
                    this.billerPriceDetailService.query({
                        page: 1,
                        count: 200,
                        idhdr: this.biller.id
                        // size: this.itemsPerPage,
                        // sort: this.sort()
                    })
                    .subscribe(
                            (res: HttpResponse<Biller[]>) => this.onSuccess(res.body, res.headers),
                            (res: HttpErrorResponse) => this.onError(res.message),
                            () => { console.log('finally'); }
                    );
                }
            }
        }
    }

    onRowClicked(e) {
        if (e.event.target !== undefined) {
            const data = e.data;
            const actionType = e.event.target.getAttribute('data-action-type');

            switch (actionType) {
                case 'view':
                    // console.log('Data row : ', data);
                    return this.openBDDialog('view', data);
                case 'edit':
                    console.log('edittttttttt', data);
                    return this.openBDDialog('edit', data);
            }
        }
    }

    openBDDialog(mode, data): void {
        console.log('open bd dialog', data);
        const datasend = this.membTypeCtrl.value.id === 1 ?
        {
            mode : 'create',
            modeTitle : 'Create',
            billerCompanyData : this.billerCompanyList,
            billerTypeData : this.billerTypeList,
            productData : this.productList,
            rowData : {
                id : null,
                billerProduct : null,
                billerHeader : null,
                externalCode : null,
                buyPrice : null,
                fee : null,
                profit : null,
                sellPrice : null,
                // billerHeaderId : null,
                billerHeaderId : (this.biller.id === undefined || this.biller.id === null ? null : this.biller.id),
                billerProductId : null,
                postPaid : null,
                status : 'ACTIVE'
            },
        } :
        {
            mode : 'create',
            modeTitle : 'Create',
            billerCompanyData : this.billerCompanyList,
            billerTypeData : this.billerTypeList,
            productData : this.productList,
            rowData : {
                id: null,
                billerProduct : null,
                billerHeader : null,
                salesPrice : null,
                profit : null,
                dateStart : null,
                dateThru : null,
                // billerHeaderId : null,
                billerHeaderId : (this.biller.id === undefined || this.biller.id === null ? null : this.biller.id),
                billerProductId : null,
            },
        };

        if (mode !== 'create') {
            datasend.mode = mode;
            datasend.modeTitle = (mode === 'view' ? 'View' : 'Edit');
            // datasend.rowData = data;
            datasend.rowData = this.membTypeCtrl.value.id === 1 ?
            {
                id : data.id,
                billerProduct : data.billerProduct,
                billerHeader : data.billerHeader,
                externalCode : data.externalCode,
                buyPrice : data.buyPrice,
                fee : data.fee,
                profit : data.profit,
                sellPrice : data.sellPrice,
                billerHeaderId : data.billerHeader.id,
                billerProductId : data.billerProduct.id,
                postPaid : data.postPaid,
                status : data.status
            } :
            {
                id: data.id,
                billerProduct : data.billerProduct,
                billerHeader : data.billerHeader,
                salesPrice : data.salesPrice,
                profit : data.profit,
                dateStart : data.dateStart,
                dateThru : data.dateThru,
                billerHeaderId : data.billerHeader.id,
                billerProductId : data.billerProduct.id,
            };
        }
        console.log('datasend : ', datasend);

        const dialogRef = this.membTypeCtrl.value.id === 1 ?
        this.dialog.open(BillerDetailComponent, {
            width: '1000px',
            data: datasend
        }) :
        this.dialog.open(BillerPriceDetailComponent, {
            width: '1000px',
            data: datasend
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed : ', result);
            // this.gridApi.rowData.push(result);
            if (result !== undefined) {
                // indirect save
                // if (result.mode === 'create') {
                //     this.gridApi.updateRowData({ add: [result.rowData] });
                // } else {
                //     this.loadAll();
                // }

                this.loadAll();
            }
        });
    }

    addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
        if (type === 'start') {
            this.biller.dateStart = this.dateFormatter(event);
        } else if (type === 'thru') {
            this.biller.dateThru = this.dateFormatter(event);
        }
    }

    dateFormatter(params): string {
        const dt  = new Date(params.value);
        const year = dt.getFullYear();
        const mth = dt.getMonth() + 1;
        const day = dt.getDate();
        // return dt.toLocaleString(['id']);
        return year + '-' + (mth < 10 ? '0' + mth : mth) + '-' + (day < 10 ? '0' + day : day);
    }

    save(): void {
        this.billerSave = {
            id: this.biller.id,
            description: this.biller.description,
            dateStart: this.biller.dateStart,
            dateThru: this.biller.dateThru,
            memberTypeId: this.membTypeCtrl.value.id,
            memberId: this.membCtrl.value.id,
            manualCode: (this.biller.manualCode === undefined ? false : this.biller.manualCode),
            memberCode: (this.biller.memberCode === undefined ? '' : this.biller.memberCode)
        };
        console.log(this.billerSave);
        if (this.billerSave.id === undefined || this.billerSave.id === null) {
            console.log('send to service ', this.billerSave);
            this.billerService.create(this.billerSave).subscribe((res: HttpResponse<Biller>) => {
                // header id = res.body.id
                console.log(res.body.id);
                this.btnDisabled = false;
                if (this.biller.id === undefined || this.biller.id === null) {
                    this.biller.id = res.body.id;
                }

                // bulk save
                // const rowData = [];
                // this.gridApi.forEachNode(function(node) {
                //     // rowData.push(node.data);
                //     this.billerDetailService.create(node.data).subscribe((xres: HttpResponse<BillerDetail>) => {
                //         this.dialogRef.close('refresh');
                //     });
                // });
            });
        } else {
            console.log('send to service ', this.billerSave);
            this.billerService.update(this.billerSave.id, this.billerSave).subscribe((res: HttpResponse<Biller>) => {
                this.dialogRef.close('refresh');
            });
        }
    }
}

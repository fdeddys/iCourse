import { Component, OnInit, Inject, Input, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';

import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Biller } from './biller.model';
import { BillerService } from './biller.service';
import { TranslateService } from '@ngx-translate/core';

import { Member, MemberService } from '../member';
import { MemberType, MemberTypeService } from '../member-type';
import { BillerCompany, BillerCompanyService } from '../biller-company';
import { BillerType, BillerTypeService } from '../biller-type';
import { Product, ProductService } from '../product';

import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatPaginator } from '@angular/material';

import { BillerDialogComponent } from './biller-dialog.component';
import { NO_DATA_GRID_MESSAGE, TOTAL_RECORD_PER_PAGE, REPORT_PATH } from '../../shared/constant/base-constant';
import { MatActionButtonComponent } from '../../shared/templates/mat-action-button.component';
import { SharedService } from '../../shared/services/shared.service';

@Component({
    selector: 'app-biller',
    templateUrl: './biller.component.html',
    styleUrls: ['./biller.component.css']
})
export class BillerComponent implements OnInit {

    // displayedColumns = ['memberName', 'memberType', 'dateStart', 'dateThru', 'status'];
    // dataSource = [];

    @ViewChild('downloadLink') private downloadLink: ElementRef;
    @ViewChild('paginator') private paginator: MatPaginator;

    private gridApi;
    private gridColumnApi;
    private resourceUrl = REPORT_PATH;
    billers: Biller[];
    biller: Biller;

    memberList = [];
    memberTypeList = [];
    billerTypeList = [];
    billerCompanyList = [];
    productList = [];
    statusList = [];
    billPayTypeList = [];
    messageNoData: string = NO_DATA_GRID_MESSAGE;
    curPage = 1;
    totalData = 0;
    totalRecord = TOTAL_RECORD_PER_PAGE;
    menuName = '';

    dateFStartCtrl: FormControl;
    dateTStartCtrl: FormControl;
    dateFThroughCtrl: FormControl;
    dateTThroughCtrl: FormControl;

    filter: BillerFilter = {
        memberName: '',
        filDateFStart: null,
        filDateTStart: null,
        filDateFThru: null,
        filDateTThru: null
    };

    filChkBox = {
        start: false,
        through: false
    };

    gridOptions = {
        columnDefs: [
            // { headerName: 'Name', field: 'name', checkboxSelection: true, width: 250, pinned: 'left', editable: true },
            { headerName: 'No', field: 'no', width: 100, pinned: 'left', editable: false },
            { headerName: 'Member Code', field: 'memberCode', width: 150, pinned: 'left', editable: false },
            { headerName: 'Name', field: 'member.name', width: 300, pinned: 'left', editable: false },
            { headerName: 'Date Start', field: 'dateStart', width: 185 },
            { headerName: 'Date Through', field: 'dateThru', width: 185 },
            { headerName: ' ', width: 150, cellRenderer: 'actionRenderer'}
        ], 
        rowData: this.billers,
        enableSorting: true,
        enableFilter: true,
        // rowSelection: "multiple"
        pagination: true,
        paginationPageSize: 10,
        suppressPaginationPanel : true,
        localeText: {noRowsToShow: this.messageNoData},
        frameworkComponents: {
            actionRenderer: MatActionButtonComponent
        }
    };

    constructor(
        translate: TranslateService,
        private dialog: MatDialog,
        private billerCompanyService: BillerCompanyService,
        private billerTypeService: BillerTypeService,
        private productService: ProductService,
        private memberService: MemberService,
        private memberTypeService: MemberTypeService,
        private billerService: BillerService,
        private route: ActivatedRoute,
        private sharedService: SharedService
    ) {
        translate.setDefaultLang('en');
        translate.use('en');

        this.dateFStartCtrl = new FormControl();
        this.dateTStartCtrl = new FormControl();
        this.dateFThroughCtrl = new FormControl();
        this.dateTThroughCtrl = new FormControl();
    }

    loadAll(page) {
        console.log('Start call function all header');
        this.billerService.query({
            allData: (this.route.snapshot.routeConfig.path === 'non-biller' ? 0 : 1),
            page: page,
            count: this.totalRecord,
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

        this.dateFStartCtrl.disable();
        this.dateTStartCtrl.disable();
        this.dateFThroughCtrl.disable();
        this.dateTThroughCtrl.disable();

        if  (this.route.snapshot.routeConfig.path === 'non-biller' ) {
            this.memberService.query({
                page: 1,
                count: 10000,
            })
            .subscribe(
                    (res: HttpResponse<Member[]>) => this.onSuccessMemb(res.body, res.headers),
                    (res: HttpErrorResponse) => this.onError(res.message),
                    () => { console.log('finally'); }
            );
        } else {
            this.memberService.findNotAsBiller({
                page: 1,
                count: 10000,
            })
            .subscribe(
                    (res: HttpResponse<Member[]>) => this.onSuccessMemb(res.body, res.headers),
                    (res: HttpErrorResponse) => this.onError(res.message),
                    () => { console.log('finally'); }
            );
        }

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

        this.sharedService.getBillPayType()
        .subscribe(
                (res) => {
                    this.billPayTypeList = res.body;
                },
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { console.log('finally'); }
        );
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

    chkBoxChgT(evt) {
        console.log('chkBoxChgT(evt) : ', evt);
        if (evt.checked) {
            this.dateFThroughCtrl.enable();
            this.dateTThroughCtrl.enable();
        } else {
            this.dateFThroughCtrl.disable();
            this.dateTThroughCtrl.disable();
            this.dateFThroughCtrl.setValue(null);
            this.dateTThroughCtrl.setValue(null);
        }
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
        this.filterBtn(1);
        this.paginator.pageIndex = 0;
    }

    filterBtn(page): void {
        if (page !== '') {
            this.curPage = page;
        }

        console.log('this.filChkBox : ', this.filChkBox);
        this.filter.filDateFStart = (this.dateFStartCtrl.value === null ? null : this.dateFormatter(this.dateFStartCtrl.value));
        this.filter.filDateTStart = (this.dateTStartCtrl.value === null ? null : this.dateFormatter(this.dateTStartCtrl.value));
        this.filter.filDateFThru = (this.dateFThroughCtrl.value === null ? null : this.dateFormatter(this.dateFThroughCtrl.value));
        this.filter.filDateTThru = (this.dateTThroughCtrl.value === null ? null : this.dateFormatter(this.dateTThroughCtrl.value));

        console.log('this.filter : ', this.filter);
        this.billerService.filter({
            allData: (this.route.snapshot.routeConfig.path === 'non-biller' ? 0 : 1),
            page: this.curPage,
            count: this.totalRecord,
            filter: this.filter,
        })
        .subscribe(
            (res: HttpResponse<Biller[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { console.log('finally'); }
        );
    }

    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;

        // console.log(this.gridApi);
        // console.log(this.gridColumnApi);

        // this.loadAll(this.curPage);
        this.filterBtn('');
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

        if (mode !== 'create') {
            this.memberList.push(data.member);
        }

        const datasend = {
            mode : 'create',
            modeTitle : 'Add',
            billType : this.route.snapshot.routeConfig.path,
            billerCompanyData : this.billerCompanyList,
            billerTypeData : this.billerTypeList,
            memberData: this.memberList,
            memberTypeData : this.memberTypeList,
            productData : this.productList,
            statusData : this.statusList,
            billPayTypeData : this.billPayTypeList,
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
                // this.loadAll(this.curPage);
                this.filterBtn('');

                if  (this.route.snapshot.routeConfig.path !== 'non-biller' ) {
                    this.memberService.findNotAsBiller({
                        page: 1,
                        count: 10000,
                    })
                    .subscribe(
                        (res: HttpResponse<Member[]>) => this.onSuccessMemb(res.body, res.headers),
                        (res: HttpErrorResponse) => this.onError(res.message),
                        () => { console.log('finally'); }
                    );
                }
            // }
            // this.animal = result;
        });
    }

    private onSuccessMemb(data, headers) {
        console.log('isi response ==> ', data);
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
            this.billers[index].dateStart = this.billers[index].dateStartLocDt;
            this.billers[index].dateThru = this.billers[index].dateThruLocDt;
        }
        this.gridApi.setRowData(this.billers);
        this.totalData = data.totalElements;
    }

    private onError(error) {
        console.log('error..');
    }

    public async exportCSV(reportType): Promise<void> {
        // const path = this.resourceUrl  + 'billerheader/' +
        //             (this.memberTypeList.length === 1 && this.memberTypeList[0].id === 1 ? 1 : 0);
        // window.open(`${path}/${reportType}`);

        const membType = (this.memberTypeList.length === 1 && this.memberTypeList[0].id === 1 ? 1 : 0);
        const blob = await this.billerService.exportCSV(reportType, membType);
        const url = window.URL.createObjectURL(blob);

        const link = this.downloadLink.nativeElement;
        // const link = document.createElement('a');
        // document.body.appendChild(link);
        // link.setAttribute('style', 'display: none');
        link.href = url;
        link.download = (membType === 1 ? 'biller-list.' : 'biller-subscriber-list.') + reportType;
        link.click();

        window.URL.revokeObjectURL(url);
    }

    public onPaginateChange($event): void {
        // console.log('events ', $event);
        this.curPage = $event.pageIndex + 1;
        // this.loadAll(this.curPage);
        this.filterBtn('');
    }

}

export interface BillerFilter {
    memberName?: string;
    filDateFStart?: string;
    filDateTStart?: string;
    filDateFThru?: string;
    filDateTThru?: string;
}

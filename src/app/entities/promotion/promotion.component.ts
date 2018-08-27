import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Promotion } from './promotion.model';
import { PromotionService } from './promotion.service';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

import { BillerCompany, BillerCompanyService } from '../biller-company';
import { BillerType, BillerTypeService } from '../biller-type';
import { Product, ProductService } from '../product';
import { Member, MemberService } from '../member';
import { Biller } from '../biller/biller.model';
import { BillerService } from '../biller/biller.service';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatPaginator } from '@angular/material';
import { GRID_THEME, CSS_BUTTON, NO_DATA_GRID_MESSAGE, TOTAL_RECORD_PER_PAGE, REPORT_PATH } from '../../shared/constant/base-constant';
import { MatActionButtonComponent } from '../../shared/templates/mat-action-button.component';

import { PromotionDialogComponent } from './promotion-dialog.component';

@Component({
    selector: 'app-promotion',
    templateUrl: './promotion.component.html',
    styleUrls: ['./promotion.component.css']
})
export class PromotionComponent implements OnInit {
    @ViewChild('downloadLink') private downloadLink: ElementRef;
    memberCtrl: FormControl;
    filteredMember: Observable<any[]>;
    billSubsCtrl: FormControl;
    filteredBillSubs: Observable<any[]>;

    private gridApi;
    private gridColumnApi;
    promotions: Promotion[];
    promotion: Promotion;

    memberList = [];
    billerTypeList = [];
    billerCompanyList = [];
    productList = [];
    billSubsList = [];
    statusList = [];
    promotionTypeList = [
        {id: 1, value: 'Discount %'},
        {id: 2, value: 'Discount Fixed Amount'},
        {id: 3, value: 'Cashback %'},
        {id: 4, value: 'Cashback Fixed Amount'}
    ];
    categoryList = [
        {id: 1, value: 'Type'},
        {id: 2, value: 'Operator'},
        {id: 3, value: 'Product'},
        {id: 4, value: 'All'}
    ];

    theme: String = GRID_THEME;
    cssButton = CSS_BUTTON  ;
    messageNoData: string = NO_DATA_GRID_MESSAGE;
    curPage = 1;
    totalData = 0;
    totalRecord = TOTAL_RECORD_PER_PAGE;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    filter: PromotionFilter = {
        name: '',
        type: null,
        applyToMemberTypeId: null,
        onBehalfMemberId: null,
        applyTo: null
    };

    gridOptions = {
        columnDefs: [
            { headerName: 'No', field: 'no', width: 100, minWidth: 100, maxWidth: 100, pinned: 'left', editable: false },
            { headerName: 'Biller Subscriber', field: 'applyToMemberType', width: 250, pinned: 'left', editable: false,
            valueFormatter: this.billerFormatter },
            { headerName: 'Name', field: 'name', width: 300, editable: false },
            { headerName: 'Type', field: 'type', width: 150, valueFormatter: this.typeFormatter },
            { headerName: 'Value', field: 'value', width: 150, valueFormatter: this.valFormatter },
            { headerName: 'Category', field: 'category', width: 150 },
            { headerName: 'Sub Category', field: 'subCategory', width: 150 },
            { headerName: 'Date Start', field: 'dateStart', width: 185, editable: false, valueFormatter: this.dateFormatterId },
            { headerName: 'Date Through', field: 'dateThrough', width: 185, editable: false , valueFormatter: this.dateFormatterId },
            { headerName: 'Status', field: 'active', width: 150 },
            { headerName: ' ', width: 80, minWidth: 80, maxWidth: 150, cellRenderer: 'actionRenderer'}
        ],
        rowData: [],
        enableSorting: true,
        enableFilter: true,
        // rowSelection: "multiple"
        pagination: true,
        enableColResize: true,
        paginationPageSize: 10,
        suppressPaginationPanel : true,
        localeText: {noRowsToShow: this.messageNoData},
        frameworkComponents: {
            // checkboxRenderer: MatCheckboxComponent,
            actionRenderer: MatActionButtonComponent
        }
    };

    typeFormatter(params): string {
        const promotionTypeList = [
            {id: 1, value: 'Discount %'},
            {id: 2, value: 'Discount Fixed Amount'},
            {id: 3, value: 'Cashback %'},
            {id: 4, value: 'Cashback Fixed Amount'}
        ];
        const temp = _.find(promotionTypeList, function(o) { return o.id === params.value; });
        if (temp === undefined) {
            return '';
        }
        return temp.value;
    }

    valFormatter(params): string {
        if (params.data.type === 1 || params.data.type === 3) {
            return params.value + '%';
        }
        const temp = (parseFloat(params.value)).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&.');
        return temp.substring(0, (temp.length - 3));
    }

    billerFormatter(params): string {
        return params.value.member.name + ' (' + params.value.memberCode + ')';
    }

    dateFormatterId(params): string {
        return new Date(params.value).toLocaleDateString('id');
    }

    constructor(
        translate: TranslateService,
        private dialog: MatDialog,
        private promotionService: PromotionService,
        private memberService: MemberService,
        private billerCompanyService: BillerCompanyService,
        private billerTypeService: BillerTypeService,
        private productService: ProductService,
        private billerService: BillerService,
    ) {
        translate.setDefaultLang('en');
        translate.use('en');

        this.memberCtrl = new FormControl();
        this.billSubsCtrl = new FormControl();
    }

    ngOnInit() {
        this.memberService.query({
            page: 1,
            count: 10000,
        })
        .subscribe(
            (res: HttpResponse<Member[]>) => this.onSuccessMem(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { console.log('finally'); }
        );

        this.billerCompanyService.query({})
        .subscribe(
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
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { console.log('finally'); }
        );

        this.productService.query({
            page: 1,
            count: 10000,
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

        this.billerService.filter({
            allData: 0,
            page: this.curPage,
            count: 10000,
            filter: {
                memberName: '',
                filDateFStart: null,
                filDateTStart: null,
                filDateFThru: null,
                filDateTThru: null,
                dateActive: true
            },
        })
        .subscribe(
            (res: HttpResponse<Biller[]>) => this.onSuccessBillNon(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { console.log('finally'); }
        );
    }

    filterMember(name: string) {
        return this.memberList.filter(member =>
        member.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
    }

    filterBillSubs(name: string) {
        return this.billSubsList.filter(billSubs =>
        billSubs.member.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
    }

    displayFnMem(member?: Member): string | undefined {
        return member ? member.name : undefined;
    }

    displayFnBillSubs(biller?: Biller): string | undefined {
        return biller ? biller.member.name + ' (' + biller.memberCode + ')' : undefined;
    }

    private onSuccessMem(data, headers) {
        this.memberList = data.content;
        this.filteredMember = this.memberCtrl.valueChanges
        .pipe(
            startWith<string | Member>(''),
            map(value => typeof value === 'string' ? value : value.name),
            map(name => name ? this.filterMember(name) : this.memberList.slice())
        );
    }

    private onSuccessBillNon(data, headers) {
        console.log('isi response requestor ==> ', data);
        this.billSubsList = data.content;
        this.filteredBillSubs = this.billSubsCtrl.valueChanges
        .pipe(
            startWith<string | Biller>(''),
            map(value => typeof value === 'string' ? value : value.member.name),
            map(name => name ? this.filterBillSubs(name) : this.billSubsList.slice())
        );
    }

    private onSuccessBillType(data, headers) {
        this.billerTypeList = data.content;
    }

    private onSuccessProduct(data, headers) {
        this.productList = data.content;
    }

    private onSuccess(data, headers) {
        console.log('success..', data);
        this.promotions = data.content;
        for (let index = 0; index < this.promotions.length; index++) {
            this.promotions[index].no = index + data.pageable.offset + 1;
        }
        this.gridApi.setRowData(this.promotions);
        this.totalData = data.totalElements;
    }

    private onError(error) {
        console.log('error..');
    }

    actionfilter(): void {
        this.paginator._pageIndex = 0;
        this.filterData(1);
    }

    filterData(page): void {
        if (page !== '') {
            this.curPage = page;
        }

        this.filter.applyToMemberTypeId = (this.billSubsCtrl.value !== null ? this.billSubsCtrl.value.id : null);
        this.filter.onBehalfMemberId = (this.memberCtrl.value !== null ? this.memberCtrl.value.id : null);

        this.promotionService.filter({
            page: this.curPage,
            count: this.totalRecord,
            filter: this.filter,
        })
        .subscribe(
            (res: HttpResponse<Promotion[]>) => this.onSuccess(res.body, res.headers),
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

        // this.loadAll(this.curPage);
        this.filterData('');
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
            memberData : this.memberList,
            billerCompanyData : this.billerCompanyList,
            billerTypeData : this.billerTypeList,
            productData : this.productList,
            promotionTypeData : this.promotionTypeList,
            categoryData : this.categoryList,
            billSubsData : this.billSubsList,
            statusData : this.statusList,
            rowData : {
                name: null,
                type: null,
                value: null,
                budget: null,
                balance: null,
                maxPromoAmount: null,
                minTransAmount: null,
                applyTo: null,
                applyToTypeId: null,
                applyToCompanyId: null,
                applyToProductId: null,
                applyToMemberTypeId: null,
                onBehalfMemberId: null,
                isActive: null,
                dateStart: null,
                dateThrough: null,
                budgetRequired: 0,
            },
        };
        if (mode !== 'create') {
            datasend.mode = mode;
            datasend.modeTitle = (mode === 'view' ? 'View' : 'Edit');
            datasend.rowData = data;
        }
        const dialogRef = this.dialog.open(PromotionDialogComponent, {
            width: '1000px',
            // height: '700px',
            data: datasend
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            // this.loadAll(this.curPage);
            this.filterData('');
        });
    }

    public async exportCSV(reportType): Promise<void> {
        // if (this.filter.status === 'ALL') {
        //     this.filter.status = null;
        // }
        const blob = await this.promotionService.exportCSV(reportType, this.filter).then(
        (resp) => {
            const url = window.URL.createObjectURL(resp.body);
            const link = this.downloadLink.nativeElement;
            link.href = url;
            link.download = resp.headers.get('File-Name');
            link.click();
            window.URL.revokeObjectURL(url);

            // this.filter.status = 'ALL';
        });
    }

    public onPaginateChange($event): void {
        // console.log('events ', $event);
        this.curPage = $event.pageIndex + 1;
        // this.loadAll(this.curPage);
        this.filterData('');
    }
}

export interface PromotionFilter {
    name?: string;
    type?: any;
    applyToMemberTypeId?: number;
    onBehalfMemberId?: number;
    applyTo?: number;
}

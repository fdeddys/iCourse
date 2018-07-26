import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import * as _ from 'lodash';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Biller } from './biller.model';
import { BillerService } from './biller.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { TranslateService } from '@ngx-translate/core';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Member } from '../member';
import { MemberType } from '../member-type';

import { BillerDetail, BillerDetailService, BillerDetailComponent } from '../biller-detail';
import { BillerPriceDetail, BillerPriceDetailService, BillerPriceDetailComponent } from '../biller-price-detail';
import { MatCheckboxComponent } from '../../shared/templates/mat-checkbox.component';
import { MatActionButtonComponent } from '../../shared/templates/mat-action-button.component';

import { GRID_THEME, NO_DATA_GRID_MESSAGE, TOTAL_RECORD_PER_PAGE, REPORT_PATH } from '../../shared/constant/base-constant';

import { SNACKBAR_DURATION_IN_MILLISECOND } from '../../shared/constant/base-constant';
import { CommonValidatorDirective } from '../../validators/common.validator';

@Component({
    selector: 'app-biller-dialog',
    templateUrl: './biller-dialog.component.html',
    styleUrls: ['./biller-dialog.component.css']
})
export class BillerDialogComponent implements OnInit {

    @ViewChild('downloadLink') private downloadLink: ElementRef;

    private gridApi;
    private gridColumnApi;
    private resourceUrl = REPORT_PATH;
    theme: String = GRID_THEME;
    // ------ auto complete
    // membTypeCtrl: FormControl;
    // filteredMembType: Observable<any[]>;
    // membCtrl: FormControl;
    // filteredMemb: Observable<any[]>;
    //
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
    statusList = [];
    billPayTypeList = [];

    modeTitle = '';
    configSuccess = {};
    configError = {};
    duration = SNACKBAR_DURATION_IN_MILLISECOND;

    // minDate = new Date(2000, 0, 1);
    // maxDate = new Date(2020, 0, 1);

    // checked = false;
    btnDisabled = true; // set to false for debug
    btnLabel = 'Biller';

    curPage = 1;
    totalData = 0;
    totalRecord = TOTAL_RECORD_PER_PAGE;
    messageNoData: string = NO_DATA_GRID_MESSAGE;

    billerForm: FormGroup;
    setMembCode = false;
    submitted = false;

    colDefs = [
        // { headerName: 'Name', field: 'name', checkboxSelection: true, width: 250, pinned: 'left', editable: true },
        // { headerName: 'External Code', field: 'externalCode', width: 150, pinned: 'left', editable: false },
        { headerName: 'No', field: 'no', width: 100, pinned: 'left', editable: false },
        { headerName: 'Product Type', field: 'billerProduct.billerType.name', width: 150 },
        { headerName: 'Product Company', field: 'billerProduct.billerCompany.name', width: 175 },
        { headerName: 'Denom', field: 'billerProduct.denom', width: 150 },
        { headerName: 'Buy Price', field: 'buyPrice', width: 125 },
        { headerName: 'Ext Code', field: 'externalCode', width: 125 },
        // { headerName: 'Fee', field: 'fee', width: 125 },
        // { headerName: 'Profit', field: 'profit', width: 125 },
        // { headerName: 'Sell Price', field: 'sellPrice', width: 125 },
        // { headerName: 'Post Paid', field: 'postPaid', width: 125 },
        // { headerName: 'Status', field: 'status', width: 150, cellRenderer: 'checkboxRenderer'},
        // { headerName: 'Bill Pay Type', field: 'billPayType', width: 125},
        { headerName: 'Status', field: 'status', width: 125},
        { headerName: ' ', width: 150, cellRenderer: 'actionRenderer'}
        // { headerName: 'Action', suppressMenu: true,
        //     suppressSorting: true,
        //     template: `
        //     <button mat-button color="primary" data-action-type="edit">
        //         Edit
        //     </button>
        //     `
        // }
    ];

    nonColDefs = [
        // { headerName: 'Name', field: 'name', checkboxSelection: true, width: 250, pinned: 'left', editable: true },
        { headerName: 'No', field: 'no', width: 60, pinned: 'left', editable: false },
        { headerName: 'Product Name', field: 'billerProduct.name', width: 240 },
        { headerName: 'Sell Price', field: 'salesPrice', width: 100 },
        { headerName: 'Profit', field: 'profit', width: 100 },
        { headerName: 'Date Start', field: 'dateStart', width: 100 },
        { headerName: 'Date Through', field: 'dateThru', width: 100 },
        { headerName: 'Status', field: 'status', width: 100},
        { headerName: ' ', width: 80, cellRenderer: 'actionRenderer'}
        // { headerName: ' ', suppressMenu: true,
        //     suppressSorting: true,
        //     template: `
        //     <button mat-button color="primary" data-action-type="edit">
        //         Edit
        //     </button>
        //     `
        // }
    ];

    gridOptions = {
        columnDefs: this.colDefs,
        rowData: [],
        enableSorting: true,
        enableFilter: true,
        // rowSelection: "multiple"
        pagination: true,
        enableColResize: true,
        paginationPageSize: 10,
        // suppressPaginationPanel : true,
        localeText: {noRowsToShow: this.messageNoData},
        // rowHeight : 41,
        frameworkComponents: {
            // checkboxRenderer: MatCheckboxComponent,
            actionRenderer: MatActionButtonComponent
        }
    };

    constructor(
        translate: TranslateService,
        private formBuilder: FormBuilder,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        public billerService: BillerService,
        public billerDetailService: BillerDetailService,
        public billerPriceDetailService: BillerPriceDetailService,
        public dialogRef: MatDialogRef<BillerDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        // ------ auto complete
        // this.membTypeCtrl = new FormControl();
        // this.filteredMembType = this.membTypeCtrl.valueChanges
        // .pipe(
        //     startWith<string | MemberType>(''),
        //     map(value => typeof value === 'string' ? value : value.name),
        //     map(name => name ? this.filterMembType(name) : this.memberTypeList.slice())
        // );

        // this.membCtrl = new FormControl();
        // this.filteredMemb = this.membCtrl.valueChanges
        // .pipe(
        //     startWith<string | Member>(''),
        //     map(value => typeof value === 'string' ? value : value.name),
        //     map(name => name ? this.filterMemb(name) : this.memberList.slice())
        // );
        //

        translate.use('en');

        this.dateSCtrl = new FormControl();
        this.dateTCtrl = new FormControl();

        this.configSuccess = {
            duration: 2500,
            panelClass: ['style-success'],
        },
        this.configError = {
            panelClass: ['style-error'],
        };
    }

    // ------ auto complete
    // filterMembType(name: string) {
    //     return this.memberTypeList.filter(memberType =>
    //     memberType.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
    // }

    // filterMemb(name: string) {
    //     return this.memberList.filter(member =>
    //     member.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
    // }

    // displayFnMem(member?: Member): string | undefined {
    //     return member ? member.name : undefined;
    // }

    // displayFnMemType(memberType?: MemberType): string | undefined {
    //     return memberType ? memberType.name : undefined;
    // }
    //

    ngOnInit() {
        console.log('ngOnInit..');

        this.billerForm = this.formBuilder.group({
            member: ['', [CommonValidatorDirective.required]],
            memberType: ['', CommonValidatorDirective.required],
            dateStart: ['', CommonValidatorDirective.required],
            dateThru: ['', CommonValidatorDirective.required]
        });

        this.biller = {};
        this.modeTitle = this.data.modeTitle;

        // ------ combo box
        this.biller = this.data.rowData;
        //

        // ------ auto complete
        // this.membTypeCtrl.setValue(this.data.rowData.memberType);
        //
        // ------ combo box
        if (this.data.rowData.memberType !== null) {
            this.biller.memberTypeId = this.data.rowData.memberType.id;
        }
        //
        if (this.data.mode !== 'create') {
            // console.log('edit mode..');
            this.btnDisabled = false;
            this.setMembCode = true;
            // this.membTypeCtrl.setValue(this.data.rowData.memberType);

            // ------ auto complete
            // this.membCtrl.setValue(this.data.rowData.member);
            //
            // ------ combo box
            this.biller.memberId = this.data.rowData.member.id;
            //
            this.dateSCtrl.setValue(this.data.rowData.dateStart);
            this.dateTCtrl.setValue(this.data.rowData.dateThru);

            // this.addEvent('start', this.data.rowData.dateStart);
            // this.addEvent('thru', this.data.rowData.dateThru);
            // const dataDate = new Date(this.data.rowData.dateStart);
        }
        // ------ auto complete
        // this.biller = this.data.rowData;
        //
        this.memberList = this.data.memberData;
        this.memberTypeList = this.data.memberTypeData;
        this.billerCompanyList = this.data.billerCompanyData;
        this.billerTypeList = this.data.billerTypeData;
        this.productList = this.data.productData;
        this.statusList = this.data.statusData;
        this.billPayTypeList = this.data.billPayTypeData;
    }

    get form() { return this.billerForm.controls; }

    private onSuccess(data, headers) {
        console.log('data detail : ', data.content);
        for (let index = 0; index < data.content.length; index++) {
            data.content[index].no = index + 1;
        }
        this.gridApi.setRowData(data.content);
        this.totalData = data.totalElements;
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

        this.loadAll(this.curPage);
    }

    getMembType(value) {
        console.log(value);
        // this.btnDisabled = false;
        // this.btnLabel = value.id === 1 ? 'Add Biller Detail' : 'Add Non Biller Detail';
        if (value.id === 1) {
            this.btnLabel = 'Biller';
            this.gridApi.setColumnDefs(this.colDefs);
        } else {
            this.btnLabel = 'Biller Subscriber';
            this.gridApi.setColumnDefs(this.nonColDefs);
        }
        this.gridApi.setRowData([]);
    }

    loadAll(page) {
        if (this.data.mode !== 'create') {
            console.log('load data update..');
            if (this.data.rowData.memberType.id === 1) {
                this.getMembType({id: 1});
                this.billerDetailService.query({
                    page: page,
                    // count: this.totalRecord,
                    count: 100000,
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
                    page: page,
                    // count: this.totalRecord,
                    count: 100000,
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
            // ------ auto complete
            // if (this.membTypeCtrl.value !== null && this.biller.id !== undefined) {
            //
            // ------ combo box
            if (this.biller.memberTypeId !== null && this.biller.id !== undefined) {
            //
                // ------ auto complete
                // if (this.membTypeCtrl.value.id === 1) {
                //
                // ------ combo box
                if (this.biller.memberTypeId === 1) {
                //
                    this.getMembType({id: 1});
                    this.billerDetailService.query({
                        page: page,
                        count: this.totalRecord,
                        idhdr: this.biller.id
                        // size: this.itemsPerPage,
                        // sort: this.sort()
                    })
                    .subscribe(
                            (res: HttpResponse<Biller[]>) => this.onSuccess(res.body, res.headers),
                            (res: HttpErrorResponse) => this.onError(res.message),
                            () => { console.log('finally'); }
                    );
                // ------ auto complete
                // } else if (this.membTypeCtrl.value.id > 1) {
                //
                // ------ combo box
                } else if (this.biller.memberTypeId > 1) {
                //
                    this.getMembType({id: 2});
                    this.billerPriceDetailService.query({
                        page: page,
                        count: this.totalRecord,
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
                if (this.data.billType === 'non-biller') {
                    this.getMembType({id: 2});
                } else {
                    this.getMembType({id: 1});
                }
            }

            // if (this.membTypeCtrl.value !== null) {
            //     if (this.membTypeCtrl.value.id === 1) {
            //         this.getMembType({id: 1});
            //     } else if (this.membTypeCtrl.value.id > 1) {
            //         this.getMembType({id: 2});
            //     }
            // }
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

    public snackbarSuccess(message) {
        this.snackBar.open(message, 'close', this.configSuccess);
    }

    public snackbarError(message) {
        this.snackBar.open(message, 'close', this.configError);
    }

    openBDDialog(mode, data): void {
        console.log('open bd dialog', data);
        // ------ auto complete
        // const datasend = this.membTypeCtrl.value.id === 1 ?
        //
        // ------ combo box
        const datasend = this.biller.memberTypeId === 1 ?
        //
        {
            mode : 'create',
            modeTitle : 'Create',
            billerCompanyData : this.billerCompanyList,
            billerTypeData : this.billerTypeList,
            productData : this.productList,
            statusData : this.statusList,
            billPayTypeData : this.billPayTypeList,
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
                billPayType : null,
                status : 'ACTIVE'
            },
        } :
        {
            mode : 'create',
            modeTitle : 'Create',
            billerCompanyData : this.billerCompanyList,
            billerTypeData : this.billerTypeList,
            productData : this.productList,
            statusData : this.statusList,
            billPayTypeData : this.billPayTypeList,
            rowData : {
                id: null,
                billerProduct : null,
                billerHeader : null,
                salesPrice : null,
                profit : null,
                profitDistributorPks: null,
                profitMemberPks: null,
                dateStart : null,
                dateThru : null,
                // billerHeaderId : null,
                billerHeaderId : (this.biller.id === undefined || this.biller.id === null ? null : this.biller.id),
                billerProductId : null,
                status : 'ACTIVE'
            },
        };

        if (mode !== 'create') {
            datasend.mode = mode;
            datasend.modeTitle = (mode === 'view' ? 'View' : 'Edit');
            // datasend.rowData = data;

            // ------ auto complete
            // datasend.rowData = this.membTypeCtrl.value.id === 1 ?
            //
            // ------ combo box
            datasend.rowData = this.biller.memberTypeId === 1 ?
            //
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
                billPayType : data.billPayType,
                status : data.status
            } :
            {
                id: data.id,
                billerProduct : data.billerProduct,
                billerHeader : data.billerHeader,
                salesPrice : data.salesPrice,
                profit : data.profit,
                profitDistributorPks : data.profitDistributorPks,
                profitMemberPks : data.profitMemberPks,
                dateStart : data.dateStart,
                dateThru : data.dateThru,
                billerHeaderId : data.billerHeader.id,
                billerProductId : data.billerProduct.id,
                status : data.status
            };
        }
        console.log('datasend : ', datasend);

        // ------ auto complete
        // const dialogRef = this.membTypeCtrl.value.id === 1 ?
        //
        // ------ combo box
        const dialogRef = this.biller.memberTypeId === 1 ?
        //
        this.dialog.open(BillerDetailComponent, {
            width: '800px',
            data: datasend
        }) :
        this.dialog.open(BillerPriceDetailComponent, {
            width: '800px',
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

                this.loadAll(this.curPage);
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

    onSubmit(): void {
        this.billerSave = {
            id: this.biller.id,
            description: this.biller.description,
            dateStart: this.biller.dateStart,
            dateThru: this.biller.dateThru,
            // ------ auto complete
            // memberTypeId: this.membTypeCtrl.value.id,
            // memberId: this.membCtrl.value.id,
            //
            // ------ combo box
            memberTypeId: this.biller.memberTypeId,
            memberId: this.biller.memberId,
            //
            manualCode: (this.biller.manualCode === undefined ? false : this.biller.manualCode),
            memberCode: (this.biller.memberCode === undefined ? '' : this.biller.memberCode)
        };
        console.log(this.billerSave);

        if (this.billerSave.id === undefined || this.billerSave.id === null) {
            console.log('send to service ', this.billerSave);
            this.billerService.create(this.billerSave).subscribe((res: HttpResponse<Biller>) => {
                    // header id = res.body.id

                    if (res.body.errMsg === '' || res.body.errMsg === null ) {
                        console.log(res.body.id);
                        this.biller.memberCode = res.body.memberCode;
                        this.btnDisabled = false;
                        if (this.biller.id === undefined || this.biller.id === null) {
                            this.biller.id = res.body.id;
                        }
                        if (this.data.billType === 'non-biller') {
                            this.loadAll(this.curPage);
                        }
                        this.snackbarSuccess('Save Success');
                    } else {
                        this.openSnackBar(res.body.errMsg, 'Ok');
                    }


                    // bulk save
                    // const rowData = [];
                    // this.gridApi.forEachNode(function(node) {
                    //     // rowData.push(node.data);
                    //     this.billerDetailService.create(node.data).subscribe((xres: HttpResponse<BillerDetail>) => {
                    //         this.dialogRef.close('refresh');
                    //     });
                    // });
                },
                (res: HttpErrorResponse) => {
                    console.log('error nya snackbar..');
                    this.snackbarError('Save Error');
                },
                () => { console.log('finally'); }
            );
        } else {
            console.log('send to service ', this.billerSave);
            // this.billerService.update(this.billerSave.id, this.billerSave).subscribe((res: HttpResponse<Biller>) => {
            //     this.dialogRef.close('refresh');
            // });
            this.billerService.update(this.billerSave.id, this.billerSave).subscribe(
                    (res: HttpResponse<Biller>) => {
                        if (res.body.errMsg === '' || res.body.errMsg === null ) {
                           // this.dialogRef.close('refresh');
                           this.openSnackBar('Save Success', 'Ok');
                        } else {
                            this.openSnackBar(res.body.errMsg, 'Ok');
                        }
                },
                (res: HttpErrorResponse) => {
                    this.snackBar.open('Error !' + res.error.message , 'Close', {
                        duration: this.duration,
                    });
                    console.log('error msh ', res.error.message);
                }
             );

        }
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
          duration: this.duration,
        });
    }
    validate(): void {
        this.submitted = true;
        // stop here if form is invalid
        if (this.billerForm.invalid) {
            return;
        }
    }

    public async exportCSV(reportType): Promise<void> {
        // const path = this.resourceUrl  +
        //             (this.biller.memberTypeId === 1 ? 'billerdetail/' : 'billerpricedetail/') +
        //             this.data.rowData.id;
        // window.open(`${path}/${reportType}`);

        const membType = (this.biller.memberTypeId === 1 ? 'billerdetail' : 'billerpricedetail');
        const blob = await this.billerService.exportDetailCSV(reportType, membType, this.data.rowData.id);
        const url = window.URL.createObjectURL(blob);

        const link = this.downloadLink.nativeElement;
        // const link = document.createElement('a');
        // document.body.appendChild(link);
        // link.setAttribute('style', 'display: none');
        link.href = url;
        link.download = (this.biller.memberTypeId === 1 ? 'biller-product-list.' : 'biller-subscriber-product-list.') + reportType;
        link.click();

        window.URL.revokeObjectURL(url);
    }

    public onPaginateChange($event): void {
        // console.log('events ', $event);
        this.curPage = $event.pageIndex + 1;
        this.loadAll(this.curPage);
    }

}

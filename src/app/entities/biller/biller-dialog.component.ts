import { Component, OnInit, Inject } from '@angular/core';
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

import { BillerDetail, BillerDetailComponent } from '../biller-detail';
import { BillerPriceDetail, BillerPriceDetailComponent } from '../biller-price-detail';

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
        { headerName: 'External Code', field: 'externalCode', width: 250, pinned: 'left', editable: false },
        { headerName: 'Buy Price', field: 'buyPrice', width: 250 },
        { headerName: 'Fee', field: 'fee', width: 250 },
        { headerName: 'Profit', field: 'profit', width: 250 },
        { headerName: 'Sell Price', field: 'sellPrice', width: 250 },
        { headerName: 'Post Paid', field: 'postPaid', width: 250 },
    ];

    nonColDefs = [
        // { headerName: 'Name', field: 'name', checkboxSelection: true, width: 250, pinned: 'left', editable: true },
        { headerName: 'Sales Price', field: 'salesPrice', width: 250 },
        { headerName: 'Profit', field: 'profit', width: 250 },
        { headerName: 'Date Start', field: 'dateStart', width: 250 },
        { headerName: 'Date Thru', field: 'dateThru', width: 250 }
    ];

    gridOptions = {
        columnDefs: this.colDefs,
        rowData: [],
        enableSorting: true,
        enableFilter: true,
        // rowSelection: "multiple"
        pagination: true,
        paginationPageSize: 10
    };

    constructor(
        private dialog: MatDialog,
        public billerService: BillerService,
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
            startWith<string | MemberType>(''),
            map(value => typeof value === 'string' ? value : value.name),
            map(name => name ? this.filterMemb(name) : this.memberList.slice())
        );
    }

    filterMembType(name: string) {
        return this.memberTypeList.filter(memberType =>
        memberType.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
    }

    filterMemb(name: string) {
        return this.memberList.filter(member =>
        member.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
    }

    displayFnMem(memberType?: MemberType): string | undefined {
        return memberType ? memberType.name : undefined;
    }

    ngOnInit() {
        this.biller = {};
        this.modeTitle = this.data.modeTitle;
        if (this.data.mode !== 'create') {
            // console.log('edit mode..');
            this.membTypeCtrl.setValue(this.data.rowData.memberType);
        }
        this.biller = this.data.rowData;
        this.memberList = this.data.memberData;
        this.memberTypeList = this.data.memberTypeData;
        this.billerCompanyList = this.data.billerCompanyData;
        this.billerTypeList = this.data.billerTypeData;
        this.productList = this.data.productData;
    }

    private onError(error) {
        console.log('error..', error);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;

        this.loadAll();
    }

    getMembType(value) {
        console.log(value);
        this.btnDisabled = false;
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
        console.log('load data..');
        this.gridApi.hideOverlay();
    }

    openBDDialog(mode, data): void {
        console.log('open dialog');
        const datasend = {
            mode : 'create',
            modeTitle : 'Create',
            billerCompanyData : this.billerCompanyList,
            billerTypeData : this.billerTypeList,
            productData : this.productList,
            // rowData : {
            //     externalCode : null,
            //     buyPrice : null,
            //     fee : null,
            //     profit : null,
            //     sellPrice : null,
            //     postPaid : null,
            // },
        };
        // if (mode !== 'create') {
        //     datasend.mode = mode;
        //     datasend.modeTitle = (mode === 'view' ? 'View' : 'Edit');
        //     datasend.rowData = data;
        // }
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
                this.gridApi.updateRowData({ add: [result] });
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
            generateMemberCode: (this.biller.generateMemberCode === undefined ? false : this.biller.generateMemberCode),
            manualCode: (this.biller.manualCode === undefined ? '' : this.biller.manualCode)
        };
        console.log(this.billerSave);
        if (this.billerSave.id === undefined || this.billerSave.id === null) {
            console.log('send to service ', this.billerSave);
            this.billerService.create(this.billerSave).subscribe((res: HttpResponse<Biller>) => {
                this.dialogRef.close('refresh');
            });
        } else {
            console.log('send to service ', this.billerSave);
            this.billerService.update(this.billerSave.id, this.billerSave).subscribe((res: HttpResponse<Biller>) => {
                this.dialogRef.close('refresh');
            });
        }
    }
}

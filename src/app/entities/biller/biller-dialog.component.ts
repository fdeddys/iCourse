import { Component, OnInit, Inject } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Biller } from './biller.model';
import { BillerService } from './biller.service';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Member } from '../member';
import { MemberType } from '../member-type';

import { BillerDetail, BillerDetailComponent } from '../biller-detail';

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

    biller: Biller;
    billerSave: Biller;

    billerDetail: BillerDetail;
    billerDetails: BillerDetail[];
    memberList = [];
    memberTypeList = [];
    billerTypeList = [];
    billerCompanyList = [];

    modeTitle = '';

    minDate = new Date(2000, 0, 1);
    maxDate = new Date(2020, 0, 1);

    gridOptions = {
        columnDefs: [
            // { headerName: 'Name', field: 'name', checkboxSelection: true, width: 250, pinned: 'left', editable: true },
            { headerName: 'External Code', field: 'externalCode', width: 250, pinned: 'left', editable: false },
            { headerName: 'Buy Price', field: 'buyPrice', width: 250 },
            { headerName: 'Fee', field: 'fee', width: 250 },
            { headerName: 'Profit', field: 'profit', width: 250 },
            { headerName: 'Sell Price', field: 'sellPrice', width: 250 },
            { headerName: 'Post Paid', field: 'postPaid', width: 250 },
        ],
        rowData: this.billerDetails,
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
    }

    filterMembType(name: string) {
        return this.memberTypeList.filter(memberType =>
        memberType.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
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
    }

    openBDDialog(mode, data): void {
        console.log('open dialog');
        const datasend = {
            mode : 'create',
            modeTitle : 'Create',
            billerCompanyData : this.billerCompanyList,
            billerTypeData : this.billerTypeList,
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
        const dialogRef = this.dialog.open(BillerDetailComponent, {
            width: '1000px',
            data: datasend
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            // this.animal = result;
        });
    }

    save(): void {
        this.billerSave = {
            id: this.biller.id,
            description: this.biller.description,
            dateStart: this.biller.dateStart,
            dateThru: this.biller.dateThru,
            memberTypeId: this.membTypeCtrl.value.id,
        };
        console.log(this.billerSave);
        if (this.biller.id === undefined || this.biller.id === null) {
            console.log('send to service ', this.biller);
            this.billerService.create(this.biller).subscribe((res: HttpResponse<Biller>) => {
                this.dialogRef.close('refresh');
            });
        } else {
            console.log('send to service ', this.biller);
            this.billerService.update(this.biller.id, this.biller).subscribe((res: HttpResponse<Biller>) => {
                this.dialogRef.close('refresh');
            });
        }
    }
}

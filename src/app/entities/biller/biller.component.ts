import { Component, OnInit, Inject } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Biller } from './biller.model';
import { BillerService } from './biller.service';

import { MemberType, MemberTypeService } from '../member-type';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { BillerDialogComponent } from './biller-dialog.component';

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
    memberTypeList = [];

    gridOptions = {
        columnDefs: [
            // { headerName: 'Name', field: 'name', checkboxSelection: true, width: 250, pinned: 'left', editable: true },
            { headerName: 'Description', field: 'description', width: 250, pinned: 'left', editable: false },
            { headerName: 'Date Start', field: 'dateStart', width: 250 },
            { headerName: 'Date Thru', field: 'dateThru', width: 250 },
            { headerName: 'Action', suppressMenu: true,
                suppressSorting: true,
                template: `
                <button mat-button color="primary" data-action-type="edit">
                    Edit
                </button>
                `
            }
        ],
        rowData: this.billers,
        enableSorting: true,
        enableFilter: true,
        // rowSelection: "multiple"
        pagination: true,
        paginationPageSize: 10
    };

    constructor(
        private dialog: MatDialog,
        private memberTypeService: MemberTypeService,
        private billerService: BillerService
    ) { }

    loadAll() {
        console.log('Start call function all header');
        this.billerService.query({
            page: 1,
            count: 20,
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
        this.memberTypeService.query({
            page: 1,
            count: 10000,
        })
        .subscribe(
                (res: HttpResponse<MemberType[]>) => this.onSuccessMembType(res.body, res.headers),
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
            memberTypeData : this.memberTypeList,
            rowData : {
                description : null,
                dateStart : null,
                dateThru : null,
                searchBy : null,
                memberId : null,
                memberTypeId : null,
            },
        };
        if (mode !== 'create') {
            datasend.mode = mode;
            datasend.modeTitle = (mode === 'view' ? 'View' : 'Edit');
            datasend.rowData = data;
        }
        const dialogRef = this.dialog.open(BillerDialogComponent, {
            width: '1000px',
            data: datasend
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            // this.animal = result;
        });
    }

    private onSuccessMembType(data, headers) {
        this.memberTypeList = data.content;
    }

    private onSuccess(data, headers) {
        console.log('success..', data);
        this.billers = data.content;
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

import { Component, OnInit, Inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Member } from './member.model';
import { MemberService } from './member.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { MemberBankDialogComponent } from './member-bank-dialog.component';
import { MemberBank } from '../member-bank/member-bank.model';
import { MemberBankService } from '../member-bank';
import { GRID_THEME } from '../../shared/constant/base-constant';

@Component({
    selector: 'app-member-dialog',
    templateUrl: './member-dialog.component.html',
    styleUrls: ['./member-dialog.component.css']
})

export class MemberDialogComponent implements OnInit {


    private gridApi;
    private gridColumnApi;
    private isUpdateData: Boolean = false;
    theme: String = GRID_THEME;

    member: Member;
    name: string;
    memberBanks: MemberBank[];

    gridOptions = {
        columnDefs: [
          { headerName: 'id', field: 'id', width: 50, pinned: 'left', editable: false },
          { headerName: 'Bank', field: 'globalSetting.name', width: 250, editable: false },
          { headerName: 'accountNumber', field: 'accountNumber', width: 250, editable: false },
        //   { headerName: 'Created at', field: 'createdAt', width: 250, valueFormatter: this.currencyFormatter },
        //   { headerName: 'Update at', field: 'updatedAt', width: 250, valueFormatter: this.currencyFormatter },
        //   { headerName: 'Created By', field: 'createdBy', width: 250 },
        //   { headerName: 'Updated By', field: 'updatedBy', width: 250 },
          { headerName: 'action', suppressMenu: true,
            suppressSorting: true,
            template:
              `<button mat-raised-button type="button" data-action-type="edit" >
                Edit
              </button>` }
          ],
          rowData: this.memberBanks,
          enableSorting: true,
          enableFilter: true,
          pagination: true,
          paginationPageSize: 10,
          cacheOverflowSize : 2,
          maxConcurrentDatasourceRequests : 2,
          infiniteInitialRowCount : 1,
          maxBlocksInCache : 2,
      };

    statuses = [
        {value: true, viewValue: 'Active'},
        {value: false, viewValue: 'Inactive'}
    ];

    constructor(
        private dialog: MatDialog,
        public memberService: MemberService,
        public memberBankService: MemberBankService,
        public dialogRef: MatDialogRef<MemberDialogComponent>,
        public snackBar: MatSnackBar,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
        this.member = {};
        if ( this.data.action === 'EDIT' ) {
            // search
            this.member = this.data.member;
            this.name = this.member.name;
            // this.loadMemberBank();
        }
    }

    openNewDialog(): void {

        if ( this.member.id === undefined ) {
            this.snackBar.open('Anda harus menyimpan klik tombol SAVE dahulu baru bisa mengisi data bank ', 'Ok', {
                duration: 2000,
            });
            return ;
        }

        const dialogRef = this.dialog.open(MemberBankDialogComponent, {
          width: '1000px',
          data: { action: 'Add', entity: 'Bank', member: this.member }
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed = [', result, ']');
          if (result === 'refresh') {
            this.loadMemberBank();
          }
        });
    }

    public onActionEditClick(data: any) {
        // console.log('View action clicked', data);
        const dialogRef = this.dialog.open(MemberBankDialogComponent, {
          width: '1000px',
          data: { action: 'EDIT', entity: 'Bank', member: this.member, memberBank: data }
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed = [', result, ']');
          if (result === 'refresh') {
            this.loadMemberBank();
          }
        });
    }

    onNoClick(): void {
        if ( this.isUpdateData === true) {
            this.dialogRef.close('refresh');
        } else {
            this.dialogRef.close();
        }

    }

    save(): void {
        console.log('isi member = ', this.member);
        // this.member.name = this.name;

        if (this.member.id === undefined) {
            console.log('send to service ', this.member);
            this.memberService.create(this.member).subscribe((res: HttpResponse<Member>) => {
                this.member = res.body;
                this.isUpdateData = true;
                console.log('refresh data ');
                // this.dialogRef.close('refresh');
            });
        } else {
            console.log('send to service ', this.member);
            this.memberService.update(this.member.id, this.member).subscribe((res: HttpResponse<Member>) => {
                this.isUpdateData = true;
                console.log('refresh data ');
                // this.dialogRef.close('refresh');
            });
        }
    }


    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;

        this.loadMemberBank();
    }

    currencyFormatter(params): string {
        const dt  = new Date(params.value);
        return dt.toLocaleString(['id']);
    }

    loadMemberBank(): void {
        if ( this.member.id === undefined ) {
            return;
        }
        this.memberBankService.getByMember(this.member.id)
            .subscribe(
                (res: HttpResponse<Member[]>) => this.onSuccess(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { console.log('finally'); }
        );
    }

    public onRowClicked(e) {
        if (e.event.target !== undefined) {
            const data = e.data;
            const actionType = e.event.target.getAttribute('data-action-type');

            switch (actionType) {
                case 'edit':
                    return this.onActionEditClick(data);
                    // console.log('edit bank');
            }
        }
    }

    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
          duration: 2000,
        });
     }

    private onSuccess(data, headers) {

        // if ( data === undefined ) {
        //     return ;
        // }

        // if ( data.content === undefined ) {
        //     return ;
        // }

        // if ( data.content.length <= 0 ) {
        //     return ;
        // }

        this.memberBanks = data;
        this.gridApi.setRowData(this.memberBanks);

    }

    private onError(error) {
      console.log('error..');
    }

}

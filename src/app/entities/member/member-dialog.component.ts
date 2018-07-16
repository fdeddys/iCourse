import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Member } from './member.model';
import { MemberService } from './member.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { MemberBankDialogComponent } from './member-bank-dialog.component';
import { MemberBank } from '../member-bank/member-bank.model';
import { MemberBankService } from '../member-bank';
import { GRID_THEME, CSS_BUTTON, NO_DATA_GRID_MESSAGE, SNACKBAR_DURATION_IN_MILLISECOND } from '../../shared/constant/base-constant';
import { REPORT_PATH  } from '../../shared/constant/base-constant';
import { MatActionButtonComponent } from '../../shared/templates/mat-action-button.component';
import { CommonValidatorDirective } from '../../validators/common.validator';
import { SharedService } from '../../shared/services/shared.service';

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
    cssButton = CSS_BUTTON  ;
    duration = SNACKBAR_DURATION_IN_MILLISECOND;
    private resourceUrl = REPORT_PATH;
    member: Member;
    name: string;
    memberBanks: MemberBank[];
    messageNoData: string = NO_DATA_GRID_MESSAGE;
    memberForm: FormGroup;
    submitted = false;
    statusList = [];

    gridOptions = {
        columnDefs: [
        //   { headerName: 'id', field: 'id', width: 50, pinned: 'left', editable: false },
          { headerName: 'Bank', field: 'globalSetting.name', width: 250, editable: false },
          { headerName: 'accountNumber', field: 'accountNumber', width: 250, editable: false },
        //   { headerName: 'Created at', field: 'createdAt', width: 250, valueFormatter: this.currencyFormatter },
        //   { headerName: 'Update at', field: 'updatedAt', width: 250, valueFormatter: this.currencyFormatter },
        //   { headerName: 'Created By', field: 'createdBy', width: 250 },
        //   { headerName: 'Updated By', field: 'updatedBy', width: 250 },
          { headerName: ' ', width: 150, cellRenderer: 'actionRenderer'}
        //   { headerName: ' ', suppressMenu: true,
        //     suppressSorting: true,
        //     template:
        //       `<button mat-raised-button type="button" data-action-type="edit"  ${this.cssButton} >
        //         Edit
        //       </button>` }
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
          localeText: {noRowsToShow: this.messageNoData},
          frameworkComponents: {
              actionRenderer: MatActionButtonComponent
          }
      };

        // statuses = [
        //     {value: 1, viewValue: 'ACTIVE'},
        //     {value: 0, viewValue: 'INACTIVE'}
        // ];

    constructor(
        private formBuilder: FormBuilder,
        private dialog: MatDialog,
        public memberService: MemberService,
        public memberBankService: MemberBankService,
        public dialogRef: MatDialogRef<MemberDialogComponent>,
        public snackBar: MatSnackBar,
        private sharedService: SharedService,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    get form() { return this.memberForm.controls; }

    ngOnInit() {
        this.memberForm = this.formBuilder.group({
            name: ['', [CommonValidatorDirective.required]],
            description: ['', CommonValidatorDirective.required]
        });

        this.member = {};
        this.member.active = true;
        if ( this.data.action === 'Edit' ) {
            // search
            this.member = this.data.member;
            this.name = this.member.name;
            // this.loadMemberBank();
        }
        this.sharedService.getStatus()
        .subscribe(
            (res) => {
                this.statusList = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { console.log('finally'); }
        );
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
          data: { action: 'Edit', entity: 'Bank', member: this.member, memberBank: data }
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

    onSubmit() {
        console.log('isi member = ', this.member);
        // this.member.name = this.name;

        if (this.member.id === undefined) {
            console.log('send to service ', this.member);
            this.memberService.create(this.member).subscribe((res: HttpResponse<Member>) => {
                if ( res.body.errMsg === '' || res.body.errMsg === null) {
                    this.openSnackBar('Save success', 'Done');
                    this.member = res.body;
                    this.isUpdateData = true;
                    console.log('refresh data ');
                    this.dialogRef.close('refresh');
                } else {
                    this.openSnackBar(res.body.errMsg, 'Ok');
                }
            });
        } else {
            console.log('send to service ', this.member);
            this.memberService.update(this.member.id, this.member).subscribe((res: HttpResponse<Member>) => {
                if ( res.body.errMsg === '' || res.body.errMsg === null) {
                    this.isUpdateData = true;
                    console.log('refresh data ');
                    this.openSnackBar('Save success', 'Done');
                    this.dialogRef.close('refresh');
                } else {
                    this.openSnackBar(res.body.errMsg, 'Ok');
                }
            });
        }
    }

    validate(): void {
        this.submitted = true;
        // stop here if form is invalid
        if (this.memberForm.invalid) {
            return;
        }
    }

    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;

        this.gridApi.setRowData([]);
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
          duration: this.duration,
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

    public async exportDetaiCSV(reportType, id): Promise<void> {
         const blob = await this.memberService.exportDetaiCSV(id);
         const url = window.URL.createObjectURL(blob);
         const link = document.createElement('a');
         document.body.appendChild(link);
         link.setAttribute('style', 'display: none');
         link.href = url;
         link.download = 'memberdetail.csv';
         link.click();
         link.remove();
         window.URL.revokeObjectURL(url);
    }


}

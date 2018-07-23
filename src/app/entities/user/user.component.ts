import { Component, OnInit } from '@angular/core';
import { User } from './user.model';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from './user.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { GRID_THEME, CSS_BUTTON, NO_DATA_GRID_MESSAGE,
        SNACKBAR_DURATION_IN_MILLISECOND, REPORT_PATH } from '../../shared/constant/base-constant';
import { TOTAL_RECORD_PER_PAGE } from '../../shared/constant/base-constant';
import { MatActionButtonComponent } from '../../shared/templates/mat-action-button.component';
import { UserDialogComponent } from './user-dialog.component';
import { UserConfirmDialogComponent } from './user-confirm-dialog.component';

import { ICellRendererAngularComp } from 'ag-grid-angular/main';
import { MatSnackBar } from '@angular/material';
import { Filter } from '../../shared/model/filter';
import { SharedService } from '../../shared/services/shared.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css', '../../layouts/content/content.component.css']
})
export class UserComponent implements OnInit {

    private gridApi;
    private gridColumnApi;
    private resourceUrl = REPORT_PATH;
    theme: String = GRID_THEME;
    cssButton = CSS_BUTTON  ;
    user: User[];
    User: User;
    statuses: any;
    messageNoData: string = NO_DATA_GRID_MESSAGE;
    duration = SNACKBAR_DURATION_IN_MILLISECOND;
    filter: Filter = {
        name: '',
        email: '',
        firstName: '',
        lastName: '',
        status: 'ALL'
    };
    curPage = 1;
    totalData = 0;
    totalRecord = TOTAL_RECORD_PER_PAGE;

    gridOptions = {
        columnDefs: [
            { headerName: 'No', field: 'nourut', width: 90, minWidth: 100, maxWidth: 100, pinned: 'left', editable: false },
            { headerName: 'User Name', field: 'name', width: 150, editable: false },
            { headerName: 'First Name', field: 'firstName', width: 190, editable: false },
            { headerName: 'Last Name', field: 'lastName', width: 220, editable: false },
            { headerName: 'Email', field: 'email', width: 180, editable: false },
            { headerName: 'Status', field: 'status', width: 120, editable: false},
            { headerName: ' ', width: 75, field: 'act1', minWidth: 150, maxWidth: 150, cellRenderer: 'actionRenderer'},
        ],
        // , valueFormatter: this.boolFormatter
        rowData: this.user,
        enableSorting: true,
        enableFilter: true,
        pagination: true,
        paginationPageSize: 10,
        enableColResize: true,
        cacheOverflowSize : 2,
        maxConcurrentDatasourceRequests : 2,
        infiniteInitialRowCount : 1,
        maxBlocksInCache : 2,
        suppressPaginationPanel : true,
        localeText: {noRowsToShow: this.messageNoData},
        frameworkComponents: {
            actionRenderer: MatActionButtonComponent,
            resetPassRenderer: MatRemoveButtonComponent
        },
        context: {
        componentParent: this
        }
    };

    boolFormatter(params): string {
        return params.value === 1 ? 'ACTIVE' : 'INACTIVE';
    }

    currencyFormatter(params): string {
        const dt  = new Date(params.value);
        return dt.toLocaleString(['id']);
    }

    constructor(    translate: TranslateService,
                    private dialog: MatDialog,
                    public snackBar: MatSnackBar,
                    private userService: UserService,
                    private sharedService: SharedService ) {
                        translate.setDefaultLang('en');
                        translate.use('en');
                    }

    public onCellClicked(e) {
        console.log('row clicked isi nya ====> ', e);
        if (e.event.target !== undefined) {
            const data = e.data;
            const colField = e.colDef.field;

            switch (colField) {
                case 'act1':
                    // return console.log('edit....');
                    return this.onActionEditClick(data);
                case 'act2':
                    // return console.log('remove....');
                    return this.onActionResetPassClick(data);
            }
        }
    }

    public onActionEditClick(data: any) {
        console.log('View action clicked', data);
        const dialogRef = this.dialog.open(UserDialogComponent, {
            width: '850px',
            data: { action: 'Edit', entity: 'User', user: data }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed = [', result, ']');
            this.loadAll(this.curPage);
        });
    }

    public onActionResetPassClick(data: User) {
        console.log('reset action clicked', data);
        const nama: string = data.name;
        const dialogConfirm = this.dialog.open(UserConfirmDialogComponent, {
            width: '800px',
            data: { warningMessage: 'Apakah anda yakin untuk Reset default password untuk user [  ' + `${nama}` + '  ]  ?',  id: data.id }
        });

        dialogConfirm.afterClosed().subscribe(result => {
            console.log('result ==> ' + result);
            if  (result === undefined || result === 'close' ) {
                console.log('The dialog was closed ');
            } else {
                console.log('status  [' + result.msg + '] id [' + result.id + ']' );

                this.userService.resetPassword(result.id )
                    .subscribe(
                        (res: HttpResponse<User>) => {
                            if (res.body.errMsg === null || res.body.errMsg === '' ) {
                                const decodePass = atob(res.body.password);
                                this.snackBar.open('Password reset to [ ' + decodePass + ' ] WITHOUT BRACKET ! ', 'ok');
                            } else {
                                this.snackBar.open('Error !' + res.body.errMsg , 'Close', {
                                    duration: this.duration,
                                });
                            }
                    // this.loadMenuRegistered(this.role.id);
                    },
                    (msg: HttpErrorResponse) => {
                        console.log(msg);
                        this.snackBar.open('Error :  ' +  msg.error.name + ' !', 'ok', {
                            duration: this.duration,
                            });
                        }
                    );
            }
        });

        }

    loadAll(page) {
        console.log('Start call function all header');
        this.userService.query({
            page: page,
            count: this.totalRecord,
        })
        .subscribe(
            (res: HttpResponse<User[]>) => this.onSuccess(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { console.log('finally'); }
        );
    }

    ngOnInit() {
        this.loadStatus();
    }

    loadStatus() {
        this.sharedService.getStatus().subscribe(
            (res: HttpResponse<String[]>) => {
                this.statuses = [];
                this.statuses.push('ALL');
                for (const datas of res.body) {
                  console.log(datas);
                  this.statuses.push(datas);
                }
            },
            (res: HttpErrorResponse ) => {
            },
            ( ) => console.log('finally')
        );
    }

    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        // params.api.sizeColumnsToFit();

        this.loadAll(this.curPage);
    }

    openNewDialog(): void {
        const dialogRef = this.dialog.open(UserDialogComponent, {
            width: '850px',
            data: { action: 'Add', entity: 'User' }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed = [', result, '] then load all');
            this.loadAll(this.curPage);
        });
    }

        private onSuccess(data, headers) {
        if ( data.content.length < 0 ) {
            return ;
        }
        this.user = data.content;
        let urut = 1;
        for (const usr of this.user) {
            usr.nourut = urut++;
        }
        this.totalData = data.totalElements;
        this.gridApi.setRowData(this.user);
    }

    private onError(error) {
        console.log('error..');
    }

    public onPaginateChange($event): void {
        // console.log('events ', $event);
        this.curPage = $event.pageIndex + 1;
        this.loadAll(this.curPage);
    }

    public async exportCSV(reportType): Promise<void> {

        const blob = await this.userService.exportCSV();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        document.body.appendChild(link);
        link.setAttribute('style', 'display: none');
        link.href = url;
        link.download = 'user.csv';
        link.click();
        link.remove();

        window.URL.revokeObjectURL(url);
    }

    filterBtn(): void {
        let statusAll = false;
        switch (this.filter.status) {
          case 'ALL':
              console.log('hapus status');
              statusAll = true;
              delete this.filter.status ;
              break;
        }

        this.userService.filter({
            page: this.curPage,
            count: this.totalRecord,
            filter: this.filter,
        })
        .subscribe(
            (res: HttpResponse<User[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { console.log('finally');
                    if ( statusAll ) {
                        this.filter.status = 'ALL';
                    }
                }
        );

    }

}

@Component({
    selector: 'app-action-cell',
    template: `
        <mat-icon style="margin-top: 12px; font-size: 20px" data-action-type="remove">clear</mat-icon>
    `,
})
export class MatRemoveButtonComponent implements ICellRendererAngularComp {
    private params: any;

    agInit(params: any): void {
        this.params = params;
        console.log('action button = ', this.params);
        console.log('isi param action button ', this.params.value);
    }

  refresh(params: any): boolean {
      return false;
  }

}

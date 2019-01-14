import { Component, OnInit, ViewChild } from '@angular/core';
import { Teacher } from './teacher.model';
import { MatDialog, MatPaginator } from '@angular/material';
import { TeacherService } from './teacher.service';
import { TeacherDialogComponent } from './teacher-dialog.component';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// import { BillerTypeConfirmComponent } from './biller-type-confirm.component';
import { GRID_THEME, CSS_BUTTON, NO_DATA_GRID_MESSAGE, REPORT_PATH, TOTAL_RECORD_PER_PAGE } from '../../shared/constant/base-constant';
import { MatActionButtonComponent } from '../../shared/templates/mat-action-button.component';
import { SharedService } from '../../shared/services/shared.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {


    private gridApi;
    private gridColumnApi;
    private resourceUrl = REPORT_PATH;
    theme: String = GRID_THEME;
    cssButton = CSS_BUTTON  ;
    Teachers: Teacher[];
    Teacher: Teacher;
    filter: Teacher;

    messageNoData: string = NO_DATA_GRID_MESSAGE;
    nativeWindow: any;
    curPage = 1;
    totalData = 0;
    totalRecord = TOTAL_RECORD_PER_PAGE;
    @ViewChild(MatPaginator) paginator: MatPaginator;


    gridOptions = {
        columnDefs: [
            { headerName: 'Code', field: 'teacherCode', width: 100, editable: false },
            { headerName: 'Name', field: 'name', width: 200, editable: false },
            { headerName: 'Address', field: 'address1', width: 200, editable: false },
            { headerName: 'Phone', field: 'phone', width: 200, editable: false },
            { headerName: 'Status', field: 'status', width: 100, editable: false },
            { headerName: ' ', width: 150, cellRenderer: 'actionRenderer'}
        ],
        rowData: this.Teachers,
        enableSorting: true,
        enableFilter: true,
        pagination: true,
        enableColResize: true,
        paginationPageSize: 10,
        cacheOverflowSize : 2,
        maxConcurrentDatasourceRequests : 2,
        infiniteInitialRowCount : 1,
        maxBlocksInCache : 2,
        suppressPaginationPanel : true,
        localeText: {noRowsToShow: this.messageNoData},
        frameworkComponents: {
            actionRenderer: MatActionButtonComponent
        }
    };
    currencyFormatter(params): string {
        const dt  = new Date(params.value);
        return dt.toLocaleString(['id']);
    }

    constructor(translateService: TranslateService,
                private dialog: MatDialog,
                private outletGroupService: TeacherService,
        private sharedService: SharedService ) {
            translateService.use('en');
            this.filter = new Teacher();
            this.Teacher = new Teacher();
            this.Teacher.name = '';
            this.Teacher.id = 0;
            this.filter.errCode = '';
            this.filter = this.Teacher;
        }

    public onRowClicked(e) {
        if (e.event.target !== undefined) {
            const data = e.data;
            const actionType = e.event.target.getAttribute('data-action-type');

        switch (actionType) {
            case 'edit':
                return this.onActionEditClick(data);
            }
        }
    }

    public onActionEditClick(data: any) {
        console.log('View action clicked', data);
        const dialogRef = this.dialog.open(TeacherDialogComponent, {
        width: '600px',
        data: { action: 'Edit', entity: 'Outlet Group', Teacher: data }
        });

        dialogRef.afterClosed().subscribe(result => {
            // console.log('The dialog was closed = [', result, ']');
            // this.loadAll(this.curPage);
            this.filterBtn('');
        });
    }

    loadAll(page) {
        console.log('Start call function all header');
        this.outletGroupService.query({
            page: page,
            count: this.totalRecord,
        })
        .subscribe(
                (res: HttpResponse<Teacher[]>) => this.onSuccess(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message),
                () => { console.log('finally'); }
        );
    }

    actionfilter(): void {
        this.paginator._pageIndex = 0;
        this.filterBtn(1);
    }

    filterBtn(page): void {
        if (page !== '') {
            this.curPage = page;
        }

        this.outletGroupService.filter({
          page: this.curPage,
          count: this.totalRecord,
          filter: this.filter,
        })
        .subscribe(
            (res: HttpResponse<Teacher[]>) => this.onSuccess(res.body, res.headers),
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { console.log('finally');

                    }
            );
        }

    ngOnInit() {

    }

    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;

        console.log(this.gridApi);
        console.log(this.gridColumnApi);
        // this.loadAll(this.curPage);
        this.filterBtn('');
    }

    openNewDialog(): void {
        const dialogRef = this.dialog.open(TeacherDialogComponent, {
            width: '600px',
            data: { action: 'Add', entity: 'Teacher' }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed = [', result, ']');
            if (result === 'refresh') {
                // this.loadAll(this.curPage);
                this.filterBtn('');
            }
        });
    }

    private onSuccess(data, headers) {
        console.log('on success ', data);
        if ( data.content.length < 0 ) {
            this.totalData = 0;
            this.gridApi.setRowData(null);
            return ;
        }
// alert(data.pageable.offset);
        this.Teachers = data.content;
        this.totalData = data.totalElements;
        this.gridApi.setRowData(this.Teachers);
    }

    private onError(error) {
        console.log('error..');
    }

    public onPaginateChange($event): void {
        // console.log('events ', $event);
        this.curPage = $event.pageIndex + 1;
        // this.loadAll(this.curPage);
        this.filterBtn('');
    }

}

import { Component, OnInit, Inject } from '@angular/core';

import { FormsModule, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Role, RoleMenuView } from './role.model';
import { RoleService } from './role.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { GRID_THEME, CSS_BUTTON, NO_DATA_GRID_MESSAGE } from '../../shared/constant/base-constant';
import { MenuService, Menu } from '../menu';

@Component({
    selector: 'app-role-dialog',
    templateUrl: './role-dialog.component.html',
    styleUrls: ['./role-dialog.component.css']
})

export class RoleDialogComponent implements OnInit {

    private gridApi;
    private gridColumnApi;
    menuSelected: any;
    emailFormControl = new FormControl('', [
        Validators.required,
        Validators.email,
      ]);

    role: Role;
    menu: Menu;
    // menus: Menu[];
    menuRegistered: RoleMenuView[];
    theme: String = GRID_THEME;
    cssButton = CSS_BUTTON  ;
    messageNoData: string = NO_DATA_GRID_MESSAGE;

    constructor(
        public roleService: RoleService,
        private menuService: MenuService,
        public dialogRef: MatDialogRef<RoleDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    gridOptions = {
        columnDefs: [
            // { headerName: 'id', field: 'id', width: 50, pinned: 'left', editable: false },
            { headerName: 'Name', field: 'menuDescription', editable: false },
            { headerName: 'Status', field: 'status', editable: false },
            { headerName: ' ', suppressMenu: true,
            suppressSorting: true,
            width: 100,
            template:
                `<button mat-raised-button type="button" data-action-type="editActivation"  ${this.cssButton} >
                Active / Inactive
                </button>
                ` }
        ],
            rowData: this.menuRegistered,
            enableSorting: true,
            enableFilter: true,
            pagination: true,
            paginationPageSize: 10,
            cacheOverflowSize : 2,
            maxConcurrentDatasourceRequests : 2,
            infiniteInitialRowCount : 1,
            maxBlocksInCache : 2,
            localeText: {noRowsToShow: this.messageNoData},
        };

    public onRowClicked(e) {
        console.log('clicked ', e);
        if (e.event.target !== undefined) {
            const data = e.data;
            const actionType = e.event.target.getAttribute('data-action-type');

            switch (actionType) {
                case 'editActivation':
                    return this.onActionClick(data);
            }
        }
    }

    onActionClick(data: any): void {
        console.log('role id' , this.role , 'menu id ', data);
        this.roleService.changeActivation(this.role.id, data.menuId )
            .subscribe(
                () => {
                    this.loadMenuRegistered(this.role.id);
                },
                () => { }
            );
    }


    ngOnInit() {
        this.role = {};
        if ( this.data.action === 'Edit' ) {
            // search
            console.log('id sending ', this.data.role);
            this.role = this.data.role;
            // this.loadMenuList(this.role.id, false);
            // this.loadMenuRegistered(this.role.id, true);
        } else {
            this.menuRegistered = null;
            // this.loadAllMenu();
        }
    }

    // loadMenuList(roleid, registered): void {
    //     this.menuService.findByRole(roleid, registered)
    //     .subscribe(
    //         (res: HttpResponse<Menu[]>) => {
    //             this.menus = res.body;
    //         },
    //         (res: HttpErrorResponse) => this.onError(res.message),
    //         () => { console.log('finally'); }
    //     );
    // }

    loadMenuRegistered(roleid): void {
        this.menuService.findByRole(roleid)
        .subscribe(
            (res: HttpResponse<RoleMenuView[]>) => {
                this.onSuccess(res.body, res.headers);
                // this.menuRegistered = res.body.content;
            },
            (res: HttpErrorResponse) => this.onError(res.message),
            () => { console.log('finally'); }
        );
    }

    // loadAllMenu(): void {
    //     this.menuService.query({
    //         page: 1,
    //         count: 1000,
    //     })
    //     .subscribe(
    //         (res: HttpResponse<Menu[]>) => {
    //             this.menus = res.body.content;
    //         },
    //         (res: HttpErrorResponse) => this.onError(res.message),
    //         () => { console.log('finally'); }
    //     );
    // }

    onNoClick(): void {
        this.dialogRef.close();
    }

    save(): void {

        console.log('isi object  ', this.role);
        if (this.role.id === undefined) {
            console.log('send to service ', this.role);
            this.roleService.create(this.role).subscribe((res: HttpResponse<Role>) => {
                this.dialogRef.close('refresh');
            });
        } else {
            console.log('send to service ', this.role);
            this.roleService.update(this.role.id, this.role).subscribe((res: HttpResponse<Role>) => {
                this.dialogRef.close('refresh');
            });
        }
    }

    onGridReady(params) {
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        params.api.sizeColumnsToFit();
        console.log(this.gridApi);
        console.log(this.gridColumnApi);
        // this.loadAll();
        console.log('Get all data');
        if ( this.role.id !== undefined ) {
            this.loadMenuRegistered(this.role.id);
        }
        // this.loadMenuList(this.role.id, false);
    }

    addMenu() {
        // this.rol
    }

    private onSuccess(data, headers) {
        // if ( data.content === undefined ) {
        //     return ;
        // }
        console.log('on success ' , data);
        this.menuRegistered = data;
        this.gridApi.setRowData(this.menuRegistered);
    }

    private onError(error) {
      console.log('error..');
    }

}

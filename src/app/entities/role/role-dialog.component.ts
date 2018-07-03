import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CSS_BUTTON, GRID_THEME, NO_DATA_GRID_MESSAGE } from '../../shared/constant/base-constant';
import { CommonValidatorDirective } from '../../validators/common.validator';
import { Menu, MenuService } from '../menu';
import { Role, RoleMenuView } from './role.model';
import { RoleService } from './role.service';
import { MatCheckboxComponent } from '../../shared/templates/mat-checkbox.component';


@Component({
    selector: 'app-role-dialog',
    templateUrl: './role-dialog.component.html',
    styleUrls: ['./role-dialog.component.css']
})

export class RoleDialogComponent implements OnInit {

    private gridApi;
    private gridColumnApi;
    menuSelected: any;
    role: Role;
    menu: Menu;
    // menus: Menu[];
    menuRegistered: RoleMenuView[];
    theme: String = GRID_THEME;
    cssButton = CSS_BUTTON  ;
    messageNoData: string = NO_DATA_GRID_MESSAGE;
    roleForm: FormGroup;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        public roleService: RoleService,
        private menuService: MenuService,
        public dialogRef: MatDialogRef<RoleDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    gridOptions = {
        columnDefs: [
            // { headerName: 'No', field: 'nourut', width: 50, pinned: 'left', editable: false },
            { headerName: 'Name', field: 'menuDescription', editable: false },
            // { headerName: 'Status', field: 'status', editable: false },
            // { headerName: ' ', suppressMenu: true,
            // suppressSorting: true,
            // width: 100,
            // template:
            //     `<button mat-raised-button type="button" data-action-type="editActivation"  ${this.cssButton} >
            //     Active / Inactive
            //     </button>
            //     ` }
            { headerName: 'Status', field: 'status', width: 150, cellRenderer: 'checkboxRenderer'}
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
            frameworkComponents: {
                checkboxRenderer: MatCheckboxComponent
            }
        };

    // public onRowClicked(e) {
    //     console.log('clicked ', e);
    //     if (e.event.target !== undefined) {
    //         const data = e.data;
    //         const actionType = e.event.target.getAttribute('data-action-type');

    //         switch (actionType) {
    //             case 'editActivation':
    //                 return this.onActionClick(data);
    //         }
    //     }
    // }

    public onCellClicked(e) {
        console.log('clicked cell ', e);
        if (e.event.target !== undefined) {
            const data = e.data;
            const colField = e.colDef.field;

            switch (colField) {
                case 'status':
                    // console.log('Send data ==> ', data);
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
        this.roleForm = this.formBuilder.group({
            name: ['', [CommonValidatorDirective.required]],
            description: ['', CommonValidatorDirective.required]
        });

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

    get form() { return this.roleForm.controls; }


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

    onSubmit() {
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

    validate(): void {
        this.submitted = true;
        // stop here if form is invalid
        if (this.roleForm.invalid) {
            return;
        }
    }

    onGridReady(params) {
        console.log('grid ready.......');
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        params.api.sizeColumnsToFit();
        console.log(this.gridApi);
        console.log(this.gridColumnApi);
        // this.loadAll();
        console.log('Get all data');
        if ( this.role.id !== undefined ) {
            this.loadMenuRegistered(this.role.id);
        } else {
            this.gridApi.setRowData([]);
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
        let urut = 1;
        console.log('on success ' , data);
        this.menuRegistered = data;
        for (const menu of this.menuRegistered) {
            menu.nourut = urut++;
          }
        this.gridApi.setRowData(this.menuRegistered);
    }

    private onError(error) {
      console.log('error..');
      this.gridApi.setRowData([]);
    }

}

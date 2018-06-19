import { Component, OnInit, Inject } from '@angular/core';

import { FormsModule, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Menu } from './menu.model';
import { MenuService } from './menu.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-menu-dialog',
    templateUrl: './menu-dialog.component.html',
    styleUrls: ['./menu-dialog.component.css']
})

export class MenuDialogComponent implements OnInit {

    emailFormControl = new FormControl('', [
        Validators.required,
        Validators.email,
      ]);

    menu: Menu;

    constructor(
        public menuService: MenuService,
        public dialogRef: MatDialogRef<MenuDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
        this.menu = {};
        if ( this.data.action === 'Edit' ) {
            // search
            console.log('id sending ', this.data.menu);
            this.menu = this.data.menu;
        }
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    save(): void {

        console.log('isi object  ', this.menu);
        if (this.menu.id === undefined) {
            console.log('send to service ', this.menu);
            this.menuService.create(this.menu).subscribe((res: HttpResponse<Menu>) => {
                this.dialogRef.close('refresh');
            });
        } else {
            console.log('send to service ', this.menu);
            this.menuService.update(this.menu.id, this.menu).subscribe((res: HttpResponse<Menu>) => {
                this.dialogRef.close('refresh');
            });
        }
    }

}

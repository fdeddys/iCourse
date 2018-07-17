import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, FormsModule, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Menu } from './menu.model';
import { MenuService } from './menu.service';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { CommonValidatorDirective } from '../../validators/common.validator';

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
    menuForm: FormGroup;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        public menuService: MenuService,
        public dialogRef: MatDialogRef<MenuDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
        this.menuForm = this.formBuilder.group({
             name: ['', [CommonValidatorDirective.required]],
             description: ['', CommonValidatorDirective.required]
         });

        this.menu = {};
        if ( this.data.action === 'Edit' ) {
            // search
            console.log('id sending ', this.data.menu);
            this.menu = this.data.menu;
        }
    }
    get form() { return this.menuForm.controls; }

    onNoClick(): void {
        this.dialogRef.close();
    }

    validate(): void {
        this.submitted = true;
        // stop here if form is invalid
        if (this.menuForm.invalid) {
            return;
        }
    }

    onSubmit(): void {

        this.submitted = true;
        if (this.menuForm.invalid) {
            return;
        }

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

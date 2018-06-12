import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { CustomMaterialModule } from './../../material.module';

import {
    MenuService,
    MenuComponent,
    MenuDialogComponent
} from './';

import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        AgGridModule.withComponents([]),
        CustomMaterialModule
    ],
    declarations: [
        MenuComponent,
        MenuDialogComponent
    ],
    entryComponents: [
        MenuComponent,
        MenuDialogComponent
    ],
    providers: [
        MenuService,
        LocalStorageService,
        SessionStorageService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MenuModule {}

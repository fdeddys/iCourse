import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { CustomMaterialModule } from './../../material.module';

import {
    AccessMatrixComponent,
    AccessMatrixService
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
        AccessMatrixComponent,
    ],
    entryComponents: [
        AccessMatrixComponent,
    ],
    providers: [
        AccessMatrixService,
        LocalStorageService,
        SessionStorageService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AccessMatrixModule {}

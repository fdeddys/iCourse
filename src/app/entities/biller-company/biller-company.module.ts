import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { CustomMaterialModule } from './../../material.module';

import {
    BillerCompanyService,
    BillerCompanyComponent,
    BillerCompanyDialogComponent
} from './';

@NgModule({
    imports: [
        FormsModule,
        AgGridModule.withComponents([]),
        CustomMaterialModule
    ],
    declarations: [
        BillerCompanyComponent,
        BillerCompanyDialogComponent
    ],
    entryComponents: [
        BillerCompanyComponent,
        BillerCompanyDialogComponent
    ],
    providers: [
        BillerCompanyService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BillerCompanyModule {}

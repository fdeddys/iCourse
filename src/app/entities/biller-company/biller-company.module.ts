import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { CustomMaterialModule } from './../../material.module';

import {
    BillerCompanyService,
    BillerCompanyComponent,
    BillerCompanyDialogComponent,
    BillerCompanyConfirmComponent,
} from './';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        AgGridModule.withComponents([]),
        CustomMaterialModule
    ],
    declarations: [
        BillerCompanyComponent,
        BillerCompanyDialogComponent,
        BillerCompanyConfirmComponent
    ],
    entryComponents: [
        BillerCompanyComponent,
        BillerCompanyDialogComponent,
        BillerCompanyConfirmComponent
    ],
    providers: [
        BillerCompanyService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BillerCompanyModule {}

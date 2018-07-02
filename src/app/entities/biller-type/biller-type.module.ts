import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { CustomMaterialModule } from './../../material.module';

import {
    BillerTypeService,
    BillerTypeComponent,
    BillerTypeDialogComponent,
    BillerTypeConfirmComponent,
} from './';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        AgGridModule.withComponents([]),
        CustomMaterialModule
    ],
    declarations: [
        BillerTypeComponent,
        BillerTypeDialogComponent,
        BillerTypeConfirmComponent
    ],
    entryComponents: [
        BillerTypeComponent,
        BillerTypeDialogComponent,
        BillerTypeConfirmComponent
    ],
    providers: [
        BillerTypeService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BillerTypeModule {}

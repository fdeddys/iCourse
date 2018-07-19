import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { CustomMaterialModule } from './../../material.module';

import {
    ResponseCodeService,
    ResponseCodeComponent,
    ResponseCodeDialogComponent,
    ResponseCodeConfirmComponent,
} from './';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        AgGridModule.withComponents([]),
        CustomMaterialModule
    ],
    declarations: [
        ResponseCodeComponent,
        ResponseCodeDialogComponent,
        ResponseCodeConfirmComponent
    ],
    entryComponents: [
        ResponseCodeComponent,
        ResponseCodeDialogComponent,
        ResponseCodeConfirmComponent
    ],
    providers: [
        ResponseCodeService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ResponseCodeModule {}

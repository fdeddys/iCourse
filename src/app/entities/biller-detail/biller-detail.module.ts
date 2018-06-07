import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { CustomMaterialModule } from './../../material.module';

import {
    BillerDetailService,
    BillerDetailComponent,
} from './';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        AgGridModule.withComponents([]),
        CustomMaterialModule
    ],
    declarations: [
        BillerDetailComponent
    ],
    entryComponents: [
        BillerDetailComponent
    ],
    providers: [
        BillerDetailService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BillerDetailModule {}

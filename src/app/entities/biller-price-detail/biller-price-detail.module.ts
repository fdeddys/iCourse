import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { CustomMaterialModule } from './../../material.module';

import {
    BillerPriceDetailService,
    BillerPriceDetailComponent,
    BillerPriceInfoBillerComponent
} from './';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        AgGridModule.withComponents([]),
        CustomMaterialModule
    ],
    declarations: [
        BillerPriceDetailComponent,
        BillerPriceInfoBillerComponent
    ],
    entryComponents: [
        BillerPriceDetailComponent,
        BillerPriceInfoBillerComponent
    ],
    providers: [
        BillerPriceDetailService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BillerPriceDetailModule {}

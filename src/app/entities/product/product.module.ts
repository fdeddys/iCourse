import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { CustomMaterialModule } from './../../material.module';

import {
    ProductService,
    ProductComponent,
    ProductDialogComponent
} from './';

@NgModule({
    imports: [
        FormsModule,
        AgGridModule.withComponents([]),
        CustomMaterialModule
    ],
    declarations: [
        ProductComponent,
        ProductDialogComponent
    ],
    entryComponents: [
        ProductComponent,
        ProductDialogComponent
    ],
    providers: [
        ProductService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductModule {}

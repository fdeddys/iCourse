import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { CustomMaterialModule } from './../../material.module';

import {
    MemberTypeService,
    MemberTypeComponent,
    MemberTypeDialogComponent,
    MemberTypeConfirmComponent,
} from './';

@NgModule({
    imports: [
        FormsModule,
        AgGridModule.withComponents([]),
        CustomMaterialModule
    ],
    declarations: [
        MemberTypeComponent,
        MemberTypeDialogComponent,
        MemberTypeConfirmComponent
    ],
    entryComponents: [
        MemberTypeComponent,
        MemberTypeDialogComponent,
        MemberTypeConfirmComponent
    ],
    providers: [
        MemberTypeService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MemberTypeModule {}

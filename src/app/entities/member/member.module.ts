import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { CustomMaterialModule } from './../../material.module';

import {
    MemberService,
    MemberComponent,
    MemberDialogComponent,
    MemberConfirmComponent,
} from './';

@NgModule({
    imports: [
        FormsModule,
        AgGridModule.withComponents([]),
        CustomMaterialModule
    ],
    declarations: [
        MemberComponent,
        MemberDialogComponent,
        MemberConfirmComponent
    ],
    entryComponents: [
        MemberComponent,
        MemberDialogComponent,
        MemberConfirmComponent
    ],
    providers: [
        MemberService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MemberModule {}

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { CustomMaterialModule } from './../../material.module';

import {
    MemberService,
    MemberComponent,
    MemberDialogComponent,
    MemberConfirmComponent,
    MemberBankDialogComponent,
} from './';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        AgGridModule.withComponents([]),
        CustomMaterialModule
    ],
    declarations: [
        MemberComponent,
        MemberDialogComponent,
        MemberConfirmComponent,
        MemberBankDialogComponent,
    ],
    entryComponents: [
        MemberComponent,
        MemberDialogComponent,
        MemberConfirmComponent,
        MemberBankDialogComponent,
    ],
    providers: [
        MemberService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MemberModule {}

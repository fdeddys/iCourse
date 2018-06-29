import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { CustomMaterialModule } from './../../material.module';
import { MemberBankComponent } from './member-bank.component';
import { MemberBankService } from './member-bank.service';


@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        AgGridModule.withComponents([]),
        CustomMaterialModule
    ],
    declarations: [
        MemberBankComponent,
    ],
    entryComponents: [
        MemberBankComponent,
    ],
    providers: [
        MemberBankService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MemberBankModule {}

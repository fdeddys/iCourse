import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { CustomMaterialModule } from './../../material.module';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import {
    MemberService,
    MemberComponent,
    MemberDialogComponent,
    MemberConfirmComponent,
    MemberBankDialogComponent,
} from './';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        AgGridModule.withComponents([]),
        CustomMaterialModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })
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

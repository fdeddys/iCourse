import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { CustomMaterialModule } from './../../material.module';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import {
    BillerPriceDetailService,
    BillerPriceDetailComponent,
    BillerPriceInfoBillerComponent
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
